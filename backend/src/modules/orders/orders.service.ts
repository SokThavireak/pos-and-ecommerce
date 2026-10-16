import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    const order = this.orderRepo.create({
      user,
      source: dto.source,
      status: OrderStatus.PENDING,
      totalAmount: dto.totalAmount,
    });
    const savedOrder = await this.orderRepo.save(order);

    const items: OrderItem[] = [];
    for (const itemDto of dto.items) {
      const product = await this.productRepo.findOne({ where: { id: itemDto.productId } });
      if (product) {
        product.stock = Math.max(0, product.stock - itemDto.quantity);
        await this.productRepo.save(product);
        this.appGateway.broadcastInventoryUpdate({
          productId: product.id,
          newStock: product.stock,
        });

        const orderItem = this.orderItemRepo.create({
          order: savedOrder,
          product,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
        });
        items.push(await this.orderItemRepo.save(orderItem));
      }
    }

    savedOrder.items = items;
    this.appGateway.broadcastOrderUpdate(savedOrder);
    return savedOrder;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findById(id);
    order.status = status;
    const updated = await this.orderRepo.save(order);
    this.appGateway.broadcastOrderUpdate(updated);
    return updated;
  }
}
