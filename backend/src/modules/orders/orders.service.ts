import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThan } from 'typeorm';
import { Order, OrderStatus } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Product } from '../../database/entities/product.entity';
import { User } from '../../database/entities/user.entity';
import { AppGateway } from '../events/app.gateway';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
    private appGateway: AppGateway,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    // 1. Double-Submit Protection: Check for identical order in last 5 seconds
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const recentDuplicate = await this.orderRepo.findOne({
      where: {
        user: { id: user.id },
        totalAmount: dto.totalAmount,
        createdAt: MoreThan(fiveSecondsAgo),
      },
      relations: ['items', 'items.product'],
    });

    if (recentDuplicate) {
      return recentDuplicate;
    }

    // 2. ACID Transaction with Pessimistic Row Locking (Prevents Race Conditions & Overselling)
    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, {
        user,
        source: dto.source,
        status: OrderStatus.PENDING,
        totalAmount: dto.totalAmount,
      });
      const savedOrder = await manager.save(Order, order);

      const items: OrderItem[] = [];
      const updatedProducts: { id: string; stock: number }[] = [];

      for (const itemDto of dto.items) {
        // PESSIMISTIC_WRITE puts a row-level lock in PostgreSQL (SELECT ... FOR UPDATE)
        // If 2 users buy the last unit at the exact same millisecond, the 2nd user waits
        // until the 1st user's transaction finishes!
        const product = await manager.findOne(Product, {
          where: { id: itemDto.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(`Product not found (ID: ${itemDto.productId})`);
        }

        // Strict Stock Check: Prevents selling when stock is insufficient
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Out of stock: "${product.name}" has only ${product.stock} units remaining (Requested: ${itemDto.quantity}).`,
          );
        }

        // Deduct inventory atomically
        product.stock -= itemDto.quantity;
        await manager.save(Product, product);
        updatedProducts.push({ id: product.id, stock: product.stock });

        const orderItem = manager.create(OrderItem, {
          order: savedOrder,
          product,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
        });
        items.push(await manager.save(OrderItem, orderItem));
      }

      savedOrder.items = items;

      // Broadcast inventory & order updates via WebSocket after transaction commits
      for (const p of updatedProducts) {
        this.appGateway.broadcastInventoryUpdate({
          productId: p.id,
          newStock: p.stock,
        });
      }
      this.appGateway.broadcastOrderUpdate(savedOrder);

      return savedOrder;
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findById(id);
    order.status = status;
    const updated = await this.orderRepo.save(order);
    this.appGateway.broadcastOrderUpdate(updated);
    return updated;
  }
}
