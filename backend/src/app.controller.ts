import { Controller, Get, Req } from '@nestjs/common';
import { DatabaseService } from './modules/database/database.service';

@Controller()
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  getRoot() {
    return {
      name: 'POS & E-Commerce Unified API',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      healthEndpoint: '/api/health',
      docs: {
        databaseStatus: '/api/database/status',
        connectivity: '/api/connectivity',
      },
    };
  }

  @Get('api/health')
  async getHealth(@Req() req: any) {
    const dbStatus = await this.databaseService.getConnectionStatus();

    const allowedOriginsEnv =
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      process.env.ALLOWED_ORIGINS ||
      '* (Dynamic Origin Reflection)';

    return {
      status: dbStatus.connected ? 'healthy' : 'degraded',
      environment: process.env.NODE_ENV || 'production',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      clientOrigin: req.headers.origin || 'direct/same-origin',
      cors: {
        enabled: true,
        allowedOrigins: allowedOriginsEnv,
      },
      database: {
        connected: dbStatus.connected,
        provider: dbStatus.provider,
        isNeon: dbStatus.isNeon,
        database: dbStatus.database,
        latencyMs: dbStatus.latencyMs,
      },
    };
  }

  @Get('api/connectivity')
  getConnectivityHandshake(@Req() req: any) {
    return {
      connected: true,
      protocol: req.protocol,
      origin: req.headers.origin || 'direct',
      host: req.headers.host,
      timestamp: new Date().toISOString(),
      message: 'Cross-origin backend-to-frontend connection verified successfully!',
    };
  }
}

