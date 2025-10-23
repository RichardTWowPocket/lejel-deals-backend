import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import type { AuthUser } from './types';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(_loginDto: LoginDto) {
    throw new UnauthorizedException('Login is handled by NextAuth');
  }

  async register(_registerDto: RegisterDto) {
    throw new UnauthorizedException('Registration is handled by NextAuth');
  }

  async validateUser(token: string): Promise<AuthUser> {
    const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('Auth secret not configured');
    }
    try {
      const payload: any = jwt.verify(token, secret);
      if (!payload?.sub || !payload?.email) {
        throw new UnauthorizedException('Invalid token');
      }
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role || 'customer',
        user_metadata: payload.user_metadata || {},
      };
    } catch (_err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserById(_userId: string): Promise<AuthUser | null> {
    return null; // Not supported with NextAuth-only backend
  }

  async getSupabaseClient() {
    throw new UnauthorizedException('Supabase client is not available');
  }

  async verifyCredentials(email: string, password: string) {
    const user = await (this.prisma as any).user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, user.hashedPassword);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let merchantIds: string[] = [];
    if (user.role === 'MERCHANT') {
      const memberships = await (this.prisma as any).merchantUser.findMany({
        where: { userId: user.id },
        select: { merchantId: true },
      });
      merchantIds = memberships.map((m) => m.merchantId);
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        merchantIds,
      },
      message: 'Credentials verified',
    };
  }

  async registerUser(dto: RegisterDto) {
    const existing = await (this.prisma as any).user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const role = 'CUSTOMER';
    const user = await (this.prisma as any).user.create({
      data: {
        email: dto.email,
        hashedPassword: hashed,
        role,
        isActive: true,
      },
    });

    if (role === 'CUSTOMER') {
      const rawName = (dto.name || '').trim();
      const parts = rawName.split(/\s+/).filter(Boolean);
      const firstName = parts.length > 0 ? parts[0] : undefined;
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;
      await (this.prisma as any).customer.create({
        data: {
          email: dto.email,
          userId: user.id,
          firstName,
          lastName,
        },
      });
    }

    return {
      success: true,
      data: { id: user.id, email: user.email, role: role.toLowerCase() },
      message: 'Registration successful',
    };
  }
}