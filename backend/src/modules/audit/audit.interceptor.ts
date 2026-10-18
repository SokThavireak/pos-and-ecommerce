import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditRouteInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditRouteInterceptor');

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const { method, originalUrl, ip, headers } = req;
    const userRole = (headers['x-user-role'] as string) || 'ANONYMOUS';
    const actorName = (headers['x-user-name'] as string) || 'Public User';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = res.statusCode || 200;

          // Categorize security and audit events
          const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
          const category = isMutation ? 'ROUTE_MUTATION' : 'ROUTE_ACCESS';

          this.auditService.create({
            actorName: `${actorName}`,
            role: userRole.toUpperCase(),
            category,
            actionDescription: `${method} ${originalUrl} [${statusCode}] (${duration}ms)`,
            meta: `IP: ${ip || req.socket?.remoteAddress || '127.0.0.1'} • Method: ${method} • Status: ${statusCode}`,
          });
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          const statusCode = err.status || 500;

          this.auditService.create({
            actorName: `${actorName}`,
            role: userRole.toUpperCase(),
            category: 'SECURITY_ALERT',
            actionDescription: `BLOCKED ${method} ${originalUrl} [${statusCode}]: ${err.message || 'Error'} (${duration}ms)`,
            meta: `IP: ${ip || req.socket?.remoteAddress || '127.0.0.1'} • Security Triggered`,
          });
        },
      }),
    );
  }
}
