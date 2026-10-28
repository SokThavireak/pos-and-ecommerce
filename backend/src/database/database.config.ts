import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { StoreSettings } from './entities/store-settings.entity';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL;

  const isNeonHost = Boolean(
    (databaseUrl && databaseUrl.includes('neon.tech')) ||
    (process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech')),
  );

  const isSsl =
    process.env.DB_SSL === 'true' ||
    isNeonHost ||
    Boolean(databaseUrl && databaseUrl.includes('sslmode=require'));

  const entities = [User, Category, Product, Order, OrderItem, StoreSettings];

  // Neon and cloud-hosted Postgres require SSL with rejectUnauthorized: false for Node pg
  const sslConfig = isSsl ? { rejectUnauthorized: false } : false;

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl: sslConfig,
      extra: isSsl
        ? {
            ssl: { rejectUnauthorized: false },
            // Neon connection pooler timeouts & keep-alive
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
          }
        : undefined,
      entities,
      synchronize: true, // Auto table generation / migration sync
      logging: process.env.DB_LOGGING === 'true',
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgrespassword',
    database: process.env.DB_NAME || 'pos_ecommerce_db',
    ssl: sslConfig,
    extra: isSsl
      ? {
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 10000,
          idleTimeoutMillis: 30000,
        }
      : undefined,
    entities,
    synchronize: true,
    logging: process.env.DB_LOGGING === 'true',
  };
}

