import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/entities/user.entity';
import { Category } from './database/entities/category.entity';
import { Product } from './database/entities/product.entity';
import { Order } from './database/entities/order.entity';
import { OrderItem } from './database/entities/order-item.entity';
import { StoreSettings } from './database/entities/store-settings.entity';
import { DatabaseSeederService } from './database/seeder.service';
import { SettingsModule } from './modules/settings/settings.module';
import { EventsModule } from './modules/events/events.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuditModule } from './modules/audit/audit.module';
import { BackupModule } from './modules/backup/backup.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgrespassword',
      database: process.env.DB_NAME || 'pos_ecommerce_db',
      entities: [User, Category, Product, Order, OrderItem, StoreSettings],
      synchronize: true, // Code-first automatic table generation
      logging: false,
    }),
    TypeOrmModule.forFeature([User, Category, Product, Order, OrderItem, StoreSettings]),
    EventsModule,
    SettingsModule,
    CatalogModule,
    UsersModule,
    OrdersModule,
    AuditModule,
    BackupModule,
  ],
  providers: [DatabaseSeederService],
})
export class AppModule {}
