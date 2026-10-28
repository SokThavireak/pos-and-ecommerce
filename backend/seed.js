require('dotenv').config();
const { Client } = require('pg');

async function seedDatabase() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL;

  console.log('--- Biolabs Database Seeder ---');

  let clientConfig = {
    connectionTimeoutMillis: 10000,
  };

  if (connectionString) {
    console.log('Connecting via DATABASE_URL...');
    clientConfig.connectionString = connectionString;
    clientConfig.ssl = { rejectUnauthorized: false };
  } else {
    console.log('Connecting via DB_* localhost parameters...');
    clientConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgrespassword',
      database: process.env.DB_NAME || 'pos_ecommerce_db',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  }

  const client = new Client(clientConfig);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');

    // 1. Create table `user` if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        "email" varchar NOT NULL UNIQUE,
        "fullName" varchar NOT NULL,
        "passwordHash" varchar NOT NULL,
        "role" varchar NOT NULL DEFAULT 'CUSTOMER',
        "avatarUrl" varchar,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      );
    `);

    // 2. Insert or update default users
    const defaultUsers = [
      {
        email: 'owner@biolabs.com',
        fullName: 'Store Owner',
        passwordHash: 'ownerpassword',
        role: 'OWNER',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      },
      {
        email: 'admin@biolabs.com',
        fullName: 'System Administrator',
        passwordHash: 'adminpassword',
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      {
        email: 'cashier@biolabs.com',
        fullName: 'Senior Cashier',
        passwordHash: 'cashierpassword',
        role: 'CASHIER',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      {
        email: 'customer@biolabs.com',
        fullName: 'Standard Customer',
        passwordHash: 'customerpassword',
        role: 'CUSTOMER',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
    ];

    for (const u of defaultUsers) {
      const exists = await client.query('SELECT id, email, role FROM "user" WHERE LOWER(email) = LOWER($1)', [u.email]);
      if (exists.rows.length === 0) {
        await client.query(
          `INSERT INTO "user" ("email", "fullName", "passwordHash", "role", "avatarUrl")
           VALUES ($1, $2, $3, $4, $5)`,
          [u.email, u.fullName, u.passwordHash, u.role, u.avatarUrl]
        );
        console.log(` Created account: ${u.email} (${u.role})`);
      } else {
        console.log(` Existing account: ${u.email} (${u.role})`);
      }
    }

    // 3. Create table `store_settings` if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS "store_settings" (
        "id" SERIAL PRIMARY KEY,
        "storeName" varchar DEFAULT 'biolabs',
        "logoUrl" varchar DEFAULT '/logo.svg',
        "colorPrimary" varchar DEFAULT '#d97757',
        "colorSecondary" varchar DEFAULT '#8b5cf6',
        "colorSurface" varchar DEFAULT '#fdf2ee',
        "updatedAt" TIMESTAMP DEFAULT now()
      );
    `);

    const settingsCount = await client.query('SELECT count(*) FROM "store_settings"');
    if (parseInt(settingsCount.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO "store_settings" ("storeName", "logoUrl", "colorPrimary", "colorSecondary", "colorSurface")
        VALUES ('biolabs', '/logo.svg', '#d97757', '#8b5cf6', '#fdf2ee');
      `);
      console.log(' Created default store settings.');
    }

    console.log('\nAll default accounts and tables are ready in your database!');
    console.log('You can now log in with:');
    console.log('  admin@biolabs.com  / adminpassword');
    console.log('  owner@biolabs.com  / ownerpassword');

    await client.end();
  } catch (err) {
    console.error('Database connection / seed failed:', err.message);
    try { await client.end(); } catch {}
    process.exit(1);
  }
}

seedDatabase();

