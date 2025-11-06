import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { AuthUser } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const Public = () => SetMetadata('isPublic', true);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
