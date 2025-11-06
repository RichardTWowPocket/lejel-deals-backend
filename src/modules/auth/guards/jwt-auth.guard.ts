import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Extract and log the raw JWT token from the request
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      console.warn('🔑 Raw JWT Token received:', {
        token: token.substring(0, 50) + '...', // Show first 50 chars for security
        fullToken: token, // Full token for debugging (remove in production)
        tokenLength: token.length,
        endpoint: `${request.method} ${request.url}`,
      });
    } else {
      console.warn('⚠️ No Authorization header found in request');
    }

    return super.canActivate(context);
  }
}
