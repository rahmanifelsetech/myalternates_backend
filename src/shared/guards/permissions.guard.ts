import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RequestWithUser } from '../interfaces/auth.types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    
    console.log('User in PermissionsGuard:', user);

    if(user.role?.slug === 'admin'){
      return true;
    }

    if (!user || !user.role || !user.role.permissions) {
      throw new ForbiddenException('User does not have necessary roles or permissions configured.');
    }

    const userPermissions = new Set(
      user.role.permissions
        .map((p) => p.permission?.slug)
        .filter((slug): slug is string => !!slug),
    );

    const missingPermissions = requiredPermissions.filter((permission) => !userPermissions.has(permission));
    if (missingPermissions.length > 0) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }

    return true;
  }
}
