import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditRouteInterceptor } from './audit.interceptor';

@Module({
  controllers: [AuditController],
  providers: [AuditService, AuditRouteInterceptor],
  exports: [AuditService, AuditRouteInterceptor],
})
export class AuditModule {}
