import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { MerchantRole } from '@prisma/client';
import { AuthUser } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * Get current merchant membership from request (set by MerchantRoleGuard)
 */
export const CurrentMerchantMembership = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.merchantMembership;
  },
);

export const Public = () => SetMetadata('isPublic', true);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const MerchantRoles = (...roles: MerchantRole[]) => SetMetadata('merchantRoles', roles);

