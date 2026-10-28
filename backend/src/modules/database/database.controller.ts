import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TestConnectionDto } from './dto/test-connection.dto';

@Controller('api/database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * GET /api/database/status
   * Check connection status of the currently connected database (Neon / PostgreSQL)
   */
  @Get('status')
  async getStatus() {
    return this.databaseService.getConnectionStatus();
  }

  /**
   * GET /api/database/neon
   * Direct alias for checking Neon connection health
   */
  @Get('neon')
  async getNeonStatus() {
    return this.databaseService.getConnectionStatus();
  }

  /**
   * POST /api/database/test
   * Test a Neon connection URI or individual parameters dynamically
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async testConnection(@Body() dto: TestConnectionDto) {
    return this.databaseService.testCustomConnection(dto);
  }

  /**
   * GET /api/database/guide
   * Get setup instructions and environment variable details for Neon
   */
  @Get('guide')
  async getGuide() {
    return this.databaseService.getNeonGuide();
  }
}

