import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { AuthUser } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.NEXTAUTH_SECRET;

    if (!jwtSecret) {
      throw new Error('NEXTAUTH_SECRET environment variable is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any): Promise<AuthUser> {
    // Log the JWT payload for debugging
    console.warn('🔐 JWT Token Payload:', {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      merchantIds: payload.merchantIds,
      customerId: payload.customerId,
      iss: payload.iss,
      aud: payload.aud,
      iat: payload.iat,
      exp: payload.exp,
      fullPayload: payload,
    });

    if (payload.iss !== 'lejel-auth' || payload.aud !== 'lejel-api') {
      throw new UnauthorizedException('Invalid token issuer or audience');
    }

    const user: AuthUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || 'customer',
      merchantIds: payload.merchantIds || [], // Include merchant IDs from JWT payload
    };

    if (!user.id || !user.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    console.warn('✅ Validated AuthUser:', {
      id: user.id,
      email: user.email,
      role: user.role,
      merchantIds: user.merchantIds,
    });

    return user;
  }
}
