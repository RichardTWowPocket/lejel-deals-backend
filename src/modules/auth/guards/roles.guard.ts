import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user) {
      return false;
    }

    // Normalize role comparison (convert to uppercase to match Prisma enum)
    const needed = requiredRoles.map((r) => String(r).toUpperCase());
    const have = String(user.role || '').toUpperCase();

    // SUPER_ADMIN has global access
    if (have === 'SUPER_ADMIN') return true;

    return needed.includes(have);
  }
}
