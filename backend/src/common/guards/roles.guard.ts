import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';
import { AuditService } from '../../modules/audit/audit.service';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no @Roles() specified, endpoint is public
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    let userRole: UserRole | null = null;
    let actorName = 'Anonymous';

    // 1. Cryptographic Token Verification (HMAC-SHA256 signature check)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const verified = this.authService.verifyToken(token);
      if (verified) {
        userRole = verified.role;
        actorName = verified.fullName || verified.email;
        req.user = verified;
      }
    }

    if (!userRole) {
      this.auditService.create({
        actorName,
        role: 'ANONYMOUS',
        category: 'SECURITY_ALERT',
        actionDescription: `BLOCKED unauthenticated ${req.method} ${req.originalUrl}. Missing or forged token.`,
        meta: `IP: ${req.ip || '127.0.0.1'} • Auth Required`,
      });
      throw new UnauthorizedException('Authentication required. Missing or forged token.');
    }

    const hasPermission = requiredRoles.includes(userRole);

    if (!hasPermission) {
      this.auditService.create({
        actorName,
        role: userRole,
        category: 'SECURITY_ALERT',
        actionDescription: `BLOCKED unauthorized ${req.method} ${req.originalUrl}. Required: [${requiredRoles.join(', ')}], Provided: [${userRole}]`,
        meta: `IP: ${req.ip || '127.0.0.1'} • RBAC Guard Enforced`,
      });

      throw new ForbiddenException(
        `Security clearance failed: Route requires [${requiredRoles.join(', ')}] role privilege.`,
      );
    }

    return true;
  }
}
