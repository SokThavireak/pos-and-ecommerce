import 'dotenv/config';
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
import { AuthModule } from './modules/auth/auth.module';

import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AuditRouteInterceptor } from './modules/audit/audit.interceptor';
import { RolesGuard } from './common/guards/roles.guard';

import { ThrottleRateLimitGuard } from './common/guards/throttle-rate-limit.guard';

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
    AuthModule,
    EventsModule,
    SettingsModule,
    CatalogModule,
    UsersModule,
    OrdersModule,
    AuditModule,
    BackupModule,
  ],
  providers: [
    DatabaseSeederService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditRouteInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottleRateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
