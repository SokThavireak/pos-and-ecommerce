import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../database/entities/user.entity';
import { Category } from '../../database/entities/category.entity';
import { Product } from '../../database/entities/product.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { StoreSettings } from '../../database/entities/store-settings.entity';
import { RestoreDatabaseDto } from './dto/backup.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(StoreSettings) private settingsRepo: Repository<StoreSettings>,
    private auditService: AuditService,
  ) {}

  async generateExportSnapshot(dto: { adminPassword: string; reason?: string }): Promise<any> {
    // 1. Password Verification for Export (Second Confirm)
    const adminUser = await this.userRepo.findOne({
      where: { role: UserRole.ADMIN },
    });

    const systemAdminSecret = process.env.ADMIN_BACKUP_SECRET;
    const isValidPassword =
      (systemAdminSecret && dto.adminPassword === systemAdminSecret) ||
      (adminUser && adminUser.passwordHash === dto.adminPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException('Security clearance failed: Invalid administrator authorization password for data export.');
    }

    const [users, categories, products, orders, settings] = await Promise.all([
      this.userRepo.find(),
      this.categoryRepo.find(),
      this.productRepo.find(),
      this.orderRepo.find({ relations: ['items', 'user'] }),
      this.settingsRepo.find(),
    ]);

    // Security: Strip passwordHash so backups never leak credentials
    const sanitizedUsers = users.map((u) => {
      const { passwordHash, ...safe } = u as any;
      return safe;
    });

    const snapshot = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      system: 'BioLabs POS & E-Commerce Core',
      stats: {
        usersCount: sanitizedUsers.length,
        categoriesCount: categories.length,
        productsCount: products.length,
        ordersCount: orders.length,
      },
      data: {
        users: sanitizedUsers,
        categories,
        products,
        orders,
        settings,
      },
    };

    this.auditService.create({
      actorName: adminUser ? adminUser.fullName : 'Admin Marcus',
      role: 'ADMIN',
      category: 'DATABASE_EXPORT',
      actionDescription: `Generated authorized full JSON database backup export (${users.length} users, ${products.length} products)`,
      meta: `2nd Confirmation Verified • Reason: ${dto.reason || 'Manual Admin Export'}`,
    });

    return snapshot;
  }

  async restoreFromSnapshot(dto: RestoreDatabaseDto): Promise<{ success: boolean; message: string; stats: any }> {
    // 1. Password Verification (Required second confirm)
    const adminUser = await this.userRepo.findOne({
      where: { role: UserRole.ADMIN },
    });

    const systemAdminSecret = process.env.ADMIN_BACKUP_SECRET;
    const isValidPassword =
      (systemAdminSecret && dto.adminPassword === systemAdminSecret) ||
      (adminUser && adminUser.passwordHash === dto.adminPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException('Security clearance failed: Invalid administrator authorization password.');
    }

    // 2. Parse Snapshot Payload
    let parsed: any;
    try {
      parsed = JSON.parse(dto.snapshotPayload);
      if (!parsed.data) {
        throw new Error('Missing data root in snapshot JSON');
      }
    } catch (e) {
      throw new BadRequestException('Malformed snapshot payload. Valid JSON structure is required.');
    }

    const { categories, products, settings } = parsed.data;

    // 3. Selective Safe Ingest / Merge
    let restoredCategories = 0;
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        const existing = await this.categoryRepo.findOne({ where: { slug: cat.slug } });
        if (!existing) {
          await this.categoryRepo.save(this.categoryRepo.create(cat));
          restoredCategories++;
        }
      }
    }

    let restoredProducts = 0;
    if (Array.isArray(products)) {
      for (const prod of products) {
        const existing = await this.productRepo.findOne({ where: { sku: prod.sku } });
        if (!existing) {
          await this.productRepo.save(this.productRepo.create(prod));
          restoredProducts++;
        }
      }
    }

    this.auditService.create({
      actorName: adminUser ? adminUser.fullName : 'Admin Marcus',
      role: 'ADMIN',
      category: 'DATABASE_RESTORE',
      actionDescription: `Executed authenticated database import & merge (${restoredCategories} categories, ${restoredProducts} products)`,
      meta: `Second Confirmation Passed • Reason: ${dto.reason || 'Manual Admin Restore'}`,
    });

    return {
      success: true,
      message: 'Database snapshot successfully verified and merged into active store ledger.',
      stats: {
        categoriesImported: restoredCategories,
        productsImported: restoredProducts,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
