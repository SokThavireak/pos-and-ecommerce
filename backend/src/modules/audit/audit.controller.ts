import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditLogDto } from './dto/audit.dto';

@Controller('api/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  getAll(@Query('role') role?: string) {
    return this.auditService.findAll(role);
  }

  @Post()
  create(@Body() dto: CreateAuditLogDto) {
    return this.auditService.create(dto);
  }
}
