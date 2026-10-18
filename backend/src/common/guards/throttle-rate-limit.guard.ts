import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuditService } from '../../modules/audit/audit.service';

interface RateRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class ThrottleRateLimitGuard implements CanActivate {
  private readonly logger = new Logger('RateLimiter');
  // In-memory sliding-window store per IP
  private readonly ipRequests = new Map<string, RateRecord>();

  constructor(private auditService: AuditService) {
    // Periodically clean up stale IP memory records every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [ip, record] of this.ipRequests.entries()) {
        if (now > record.resetTime) {
          this.ipRequests.delete(ip);
        }
      }
    }, 5 * 60 * 1000);
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const clientIp =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    const now = Date.now();
    const isAuthRoute = req.originalUrl?.includes('/api/auth/login');
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

    // Limit definitions:
    // - Auth login: Max 10 attempts per minute (stops credential stuffing/brute force)
    // - Data Mutations (POST/PATCH/DELETE): Max 30 mutations per minute (stops spam order/data creation)
    // - General reads (GET): Max 120 requests per minute (stops rapid scraping / DDoS floods)
    let maxRequests = 120;
    let windowMs = 60 * 1000;

    if (isAuthRoute) {
      maxRequests = 10;
    } else if (isMutation) {
      maxRequests = 30;
    }

    const key = `${clientIp}:${isAuthRoute ? 'auth' : isMutation ? 'mutate' : 'read'}`;
    const record = this.ipRequests.get(key);

    if (!record || now > record.resetTime) {
      this.ipRequests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return true;
    }

    record.count++;
    const remaining = Math.max(0, maxRequests - record.count);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);

      // Record high-severity security alert in audit trail
      this.auditService.create({
        actorName: `IP ${clientIp}`,
        role: 'ANONYMOUS',
        category: 'SECURITY_ALERT',
        actionDescription: `DDoS/SPAM RATE LIMIT TRIGGERED: ${req.method} ${req.originalUrl} (${record.count} reqs in 60s)`,
        meta: `Client IP: ${clientIp} • Status 429 Too Many Requests • Cooldown: ${retryAfter}s`,
      });

      this.logger.warn(`Rate limit exceeded for IP ${clientIp} on ${req.method} ${req.originalUrl}`);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `DDoS Protection: Too many requests from this IP. Please wait ${retryAfter} seconds before trying again.`,
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
