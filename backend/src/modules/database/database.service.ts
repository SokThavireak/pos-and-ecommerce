import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TestConnectionDto } from './dto/test-connection.dto';

// Use require for pg to avoid mandatory @types/pg dependency
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('pg');

export interface DatabaseStatusResponse {
  connected: boolean;
  provider: string;
  isNeon: boolean;
  host?: string;
  port?: number | string;
  database?: string;
  user?: string;
  serverVersion?: string;
  latencyMs?: number;
  ssl?: boolean;
  currentTime?: string;
  tables?: string[];
  tablesCount?: number;
  error?: string;
  message: string;
}

export interface ConnectionTestResult {
  success: boolean;
  isNeon: boolean;
  latencyMs: number;
  database?: string;
  user?: string;
  serverVersion?: string;
  currentTime?: string;
  message: string;
  error?: string;
  code?: string;
  troubleshooting?: string[];
}

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Get live status of the currently active database connection in NestJS
   */
  async getConnectionStatus(): Promise<DatabaseStatusResponse> {
    const startTime = Date.now();

    try {
      if (!this.dataSource || !this.dataSource.isInitialized) {
        return {
          connected: false,
          provider: 'unknown',
          isNeon: false,
          error: 'DataSource is not initialized',
          message: 'Backend has not established a database connection yet.',
        };
      }

      // Query version, database name, user and current timestamp
      const [identity] = await this.dataSource.query(
        'SELECT NOW() as current_time, version() as server_version, current_database() as database_name, current_user as current_user',
      );

      const latencyMs = Date.now() - startTime;

      // Query list of tables in public schema
      const tablesResult = await this.dataSource.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name ASC`,
      );
      const tables = (tablesResult || []).map((row: any) => row.table_name);

      // Determine host and connection details from options
      const options: any = this.dataSource.options;
      const rawHost = options.host || (options.url ? this.extractHostFromUrl(options.url) : 'localhost');
      const isNeon = this.detectIsNeon(rawHost, identity?.server_version);
      const isSsl = Boolean(options.ssl || (options.extra && options.extra.ssl));

      return {
        connected: true,
        provider: isNeon ? 'Neon Serverless PostgreSQL' : 'PostgreSQL',
        isNeon,
        host: rawHost,
        port: options.port || (options.url ? this.extractPortFromUrl(options.url) : 5432),
        database: identity?.database_name || options.database,
        user: identity?.current_user || options.username,
        serverVersion: identity?.server_version,
        latencyMs,
        ssl: isSsl,
        currentTime: identity?.current_time ? new Date(identity.current_time).toISOString() : new Date().toISOString(),
        tables,
        tablesCount: tables.length,
        message: isNeon
          ? 'Successfully connected to Neon Serverless PostgreSQL database!'
          : 'Successfully connected to PostgreSQL database!',
      };
    } catch (err: any) {
      this.logger.error(`Database connection check failed: ${err.message}`, err.stack);
      return {
        connected: false,
        provider: 'unknown',
        isNeon: false,
        error: err.message,
        message: 'Failed to connect to database. Please check your credentials and network access.',
      };
    }
  }

  /**
   * Dynamically test a Neon or PostgreSQL connection without restarting the server
   */
  async testCustomConnection(dto: TestConnectionDto): Promise<ConnectionTestResult> {
    const startTime = Date.now();

    // Determine target connection URL or parameters
    let connectionString = dto.connectionString;
    const envUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

    if (!connectionString && !dto.host && envUrl) {
      connectionString = envUrl;
    }

    const targetHost = dto.host || (connectionString ? this.extractHostFromUrl(connectionString) : process.env.DB_HOST || 'localhost');
    const isNeonHost = targetHost.includes('neon.tech');
    const isSsl = dto.ssl !== undefined ? dto.ssl : (isNeonHost || (connectionString && connectionString.includes('neon.tech')) || process.env.DB_SSL === 'true');

    // Build pg client config
    const clientConfig: any = {
      connectionTimeoutMillis: 7000,
    };

    if (connectionString) {
      clientConfig.connectionString = connectionString;
    } else {
      clientConfig.host = dto.host || process.env.DB_HOST || 'localhost';
      clientConfig.port = dto.port || parseInt(process.env.DB_PORT || '5432', 10);
      clientConfig.user = dto.user || process.env.DB_USER || 'postgres';
      clientConfig.password = dto.password !== undefined ? dto.password : process.env.DB_PASSWORD;
      clientConfig.database = dto.database || process.env.DB_NAME || 'pos_ecommerce_db';
    }

    if (isSsl) {
      clientConfig.ssl = { rejectUnauthorized: false };
    }

    const client = new Client(clientConfig);

    try {
      await client.connect();

      const res = await client.query(
        'SELECT NOW() as current_time, version() as server_version, current_database() as database_name, current_user as current_user',
      );

      const latencyMs = Date.now() - startTime;
      const row = res.rows[0] || {};
      const isNeon = this.detectIsNeon(targetHost, row.server_version);

      await client.end();

      return {
        success: true,
        isNeon,
        latencyMs,
        database: row.database_name,
        user: row.current_user,
        serverVersion: row.server_version,
        currentTime: row.current_time ? new Date(row.current_time).toISOString() : new Date().toISOString(),
        message: isNeon
          ? `Verified! Successfully connected to Neon database "${row.database_name}" in ${latencyMs}ms.`
          : `Verified! Successfully connected to database "${row.database_name}" in ${latencyMs}ms.`,
      };
    } catch (err: any) {
      try {
        await client.end();
      } catch {
        // ignore disconnect error
      }

      const troubleshooting: string[] = [];

      if (isNeonHost || (connectionString && connectionString.includes('neon.tech'))) {
        troubleshooting.push(
          'Ensure sslmode=require is in your connection string (Neon strictly requires SSL).',
          'Check that your Neon compute endpoint is active (endpoints may take a few seconds to wake from idle).',
          'Verify the database password in the Neon Console (Neon -> Project -> Connection Details).',
          'Use the pooled connection string (ep-xyz-pooler.neon.tech) for production environments.',
        );
      } else {
        troubleshooting.push(
          'Ensure PostgreSQL is running on the specified host and port.',
          'Verify username, password, and database existence.',
        );
      }

      return {
        success: false,
        isNeon: isNeonHost,
        latencyMs: Date.now() - startTime,
        error: err.message,
        code: err.code,
        message: `Connection failed: ${err.message}`,
        troubleshooting,
      };
    }
  }

  /**
   * Returns guidance and instructions for setting up Neon PostgreSQL
   */
  getNeonGuide() {
    return {
      title: 'Neon Serverless PostgreSQL Setup Guide',
      steps: [
        {
          step: 1,
          action: 'Create a Neon Account & Project',
          details: 'Sign up at https://neon.tech and create a new project. Neon provides a free-tier serverless PostgreSQL database.',
        },
        {
          step: 2,
          action: 'Copy Connection Details',
          details: 'From your Neon project Dashboard, copy the PostgreSQL connection string. Select "Pooled connection" for optimal performance under load.',
          sampleUrl: 'postgresql://neondb_owner:npg_samplePass123@ep-cool-lake-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
        },
        {
          step: 3,
          action: 'Configure Environment Variables',
          details: 'Paste the connection string into your backend/.env file under DATABASE_URL.',
          envExample: 'DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-cool-lake-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"',
        },
        {
          step: 4,
          action: 'Restart backend',
          details: 'TypeORM will automatically detect Neon, enable SSL, create all database tables (users, categories, products, orders, settings), and seed initial administrative data!',
        },
      ],
      supportedEnvVariables: [
        { key: 'DATABASE_URL', description: 'Recommended: Full Neon connection string with ?sslmode=require' },
        { key: 'NEON_DATABASE_URL', description: 'Alternative alias for DATABASE_URL' },
        { key: 'DB_HOST', description: 'Neon hostname (e.g. ep-xyz.us-east-2.aws.neon.tech)' },
        { key: 'DB_PORT', description: 'Postgres port (defaults to 5432)' },
        { key: 'DB_USER', description: 'Neon user (e.g. neondb_owner)' },
        { key: 'DB_PASSWORD', description: 'Neon password' },
        { key: 'DB_NAME', description: 'Neon database name (defaults to neondb or pos_ecommerce_db)' },
        { key: 'DB_SSL', description: 'Set to "true" to force SSL mode (automatically true for Neon)' },
      ],
    };
  }

  private detectIsNeon(host?: string, versionStr?: string): boolean {
    if (host && host.includes('neon.tech')) return true;
    if (versionStr && /neon/i.test(versionStr)) return true;
    return false;
  }

  private extractHostFromUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      const match = url.match(/@([^:/]+)/);
      return match ? match[1] : 'unknown';
    }
  }

  private extractPortFromUrl(url: string): number {
    try {
      const parsed = new URL(url);
      return parsed.port ? parseInt(parsed.port, 10) : 5432;
    } catch {
      return 5432;
    }
  }
}

