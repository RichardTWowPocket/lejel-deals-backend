import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../types';

export enum UserRole {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  STAFF = 'staff',
  ADMIN = 'admin',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | string[]>('roles', [
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

    const needed = (requiredRoles as any[]).map((r) => String(r).toLowerCase());
    const have = String(user.role || '').toLowerCase();
    if (have === 'admin') return true; // global admin bypass
    return needed.includes(have);
  }
}