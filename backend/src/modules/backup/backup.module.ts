import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Category } from '../../database/entities/category.entity';
import { Product } from '../../database/entities/product.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { StoreSettings } from '../../database/entities/store-settings.entity';
import { AuditModule } from '../audit/audit.module';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Product, Order, OrderItem, StoreSettings]),
    AuditModule,
  ],
  controllers: [BackupController],
  providers: [BackupService],
  exports: [BackupService],
})
export class BackupModule {}
