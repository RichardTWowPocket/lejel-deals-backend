import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { AuthUser } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('NEXTAUTH_SECRET or SUPABASE_JWT_SECRET environment variable is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any): Promise<AuthUser> {
    console.log('[JwtStrategy] Payload received:', payload);
    
    // Handle NextAuth tokens - they have a different structure
    if (payload.sub && payload.email) {
      // This is likely a NextAuth token
      const user: AuthUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role || 'customer',
        user_metadata: payload.user_metadata || {},
      };
      
      console.log('[JwtStrategy] NextAuth user:', user);
      return user;
    }
    
    // Handle Supabase tokens
    const rawRole = payload?.role || payload?.app_metadata?.role || payload?.user_metadata?.role;
    const normalizedRole = (rawRole === 'authenticated' || !rawRole) ? 'customer' : String(rawRole).toLowerCase();
    
    const user: AuthUser = {
      id: payload.sub || payload.id,
      email: payload.email,
      role: normalizedRole,
      user_metadata: payload.user_metadata || {},
    };
    
    if (!user.id || !user.email) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    console.log('[JwtStrategy] Supabase user:', user);
    return user;
  }
}