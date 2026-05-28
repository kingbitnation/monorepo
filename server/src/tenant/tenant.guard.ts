import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantId: string | undefined =
      request.headers['x-tenant-id'] ?? request.user?.tenantId;

    if (!tenantId) {
      throw new UnauthorizedException('Tenant context is required');
    }

    request.tenantId = tenantId;
    return true;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    tenantId?: string;
  }
}

