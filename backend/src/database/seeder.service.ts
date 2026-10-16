import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { StoreSettings } from './entities/store-settings.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(StoreSettings) private settingsRepo: Repository<StoreSettings>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedSettings();
    await this.seedUsers();
    await this.seedCatalog();
  }

  private async seedSettings() {
    const count = await this.settingsRepo.count();
    if (count === 0) {
      await this.settingsRepo.save({
        storeName: 'biolabs',
        logoUrl: '/logo.svg',
        colorPrimary: '#d97757',
        colorSecondary: '#8b5cf6',
        colorSurface: '#fdf2ee',
      });
      this.logger.log('Default StoreSettings seeded successfully.');
    }
  }

  private async seedUsers() {
    const count = await this.userRepo.count();
    if (count === 0) {
      await this.userRepo.save([
        {
          email: 'owner@biolabs.com',
          fullName: 'Store Owner',
          passwordHash: '$2b$10$wE9l1cO.W72R90ZlJ1Q7Ie9UfG1zR/Gv.fL/zQ7n6lPZfK2dM4r6a',
          role: UserRole.OWNER,
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        },
        {
          email: 'admin@biolabs.com',
          fullName: 'System Administrator',
          passwordHash: '$2b$10$wE9l1cO.W72R90ZlJ1Q7Ie9UfG1zR/Gv.fL/zQ7n6lPZfK2dM4r6a',
          role: UserRole.ADMIN,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
        {
          email: 'cashier@biolabs.com',
          fullName: 'Senior Cashier',
          passwordHash: '$2b$10$wE9l1cO.W72R90ZlJ1Q7Ie9UfG1zR/Gv.fL/zQ7n6lPZfK2dM4r6a',
          role: UserRole.CASHIER,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        },
        {
          email: 'customer@biolabs.com',
          fullName: 'Standard Customer',
          passwordHash: '$2b$10$wE9l1cO.W72R90ZlJ1Q7Ie9UfG1zR/Gv.fL/zQ7n6lPZfK2dM4r6a',
          role: UserRole.CUSTOMER,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        },
      ]);
      this.logger.log('Default Users (OWNER, ADMIN, CASHIER, CUSTOMER) seeded successfully.');
    }
  }

  private async seedCatalog() {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      const catPeptides = await this.categoryRepo.save({
        name: 'Precision Peptides',
        slug: 'precision-peptides',
        description: 'Targeted research grade compounds',
      });
      const catApparel = await this.categoryRepo.save({
        name: 'Editorial Apparel',
        slug: 'editorial-apparel',
        description: 'Minimalist relaxed linen and cotton wear',
      });
      const catAccessories = await this.categoryRepo.save({
        name: 'Accessories',
        slug: 'accessories',
        description: 'Leather bags, timepieces, eyewear',
      });

      await this.productRepo.save([
        {
          name: 'GHk-Cu 50mg Research Vial',
          sku: 'PEP-GHKCU-50',
          barcode: '8934500101',
          spec: '50mg Lyophilized',
          price: 65.00,
          oldPrice: 85.00,
          stock: 120,
          category: catPeptides,
          imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
        },
        {
          name: 'NAD+ 500mg Cellular Vial',
          sku: 'PEP-NAD-500',
          barcode: '8934500102',
          spec: '500mg Pure Grade',
          price: 95.00,
          oldPrice: 120.00,
          stock: 45,
          category: catPeptides,
          imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500',
        },
        {
          name: 'BPC-157 Regenerative Formula',
          sku: 'PEP-BPC157-10',
          barcode: '8934500103',
          spec: '10mg Bio-Active',
          price: 52.00,
          oldPrice: 65.00,
          stock: 90,
          category: catPeptides,
          imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500',
        },
        {
          name: 'Sleeved Cardigan in Charcoal',
          sku: 'APP-CARD-01',
          barcode: '8934500201',
          spec: 'Size M / L',
          price: 52.25,
          oldPrice: 55.00,
          stock: 118,
          category: catApparel,
          imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
        },
        {
          name: 'Relaxed Fit Linen Shorts',
          sku: 'APP-SHRT-02',
          barcode: '8934500202',
          spec: 'Off-White / 32',
          price: 49.50,
          oldPrice: 60.00,
          stock: 328,
          category: catApparel,
          imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500',
        },
        {
          name: 'Custom T-Shirt for Men',
          sku: 'APP-TSHRT-03',
          barcode: '8934500203',
          spec: 'Heavyweight Cotton',
          price: 28.00,
          oldPrice: 35.00,
          stock: 210,
          category: catApparel,
          imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
        },
        {
          name: 'Small Travel Leather Barrel Bag',
          sku: 'ACC-BAG-01',
          barcode: '8934500301',
          spec: 'Cognac Saddle Leather',
          price: 185.00,
          oldPrice: 220.00,
          stock: 35,
          category: catAccessories,
          imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
        },
        {
          name: 'Wood Finish Sunglasses',
          sku: 'ACC-SUN-02',
          barcode: '8934500302',
          spec: 'Polarized UV400',
          price: 68.00,
          oldPrice: 85.00,
          stock: 75,
          category: catAccessories,
          imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
        },
      ]);
      this.logger.log('Sample Catalog (Categories & Products) seeded successfully.');
    }
  }
}
