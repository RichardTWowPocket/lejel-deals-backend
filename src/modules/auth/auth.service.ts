import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RegisterDto, OAuthGoogleDto } from './dto/auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

const profileInclude = {
  customer: true,
  merchants: {
    include: {
      merchant: true,
    },
  },
} as const;

type UserWithRelations = Prisma.UserGetPayload<{
  include: typeof profileInclude;
}>;

type UserCreateWithHash = Omit<Prisma.UserCreateInput, 'hashedPassword'> & {
  hashedPassword: string;
};

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private formatUser(user: UserWithRelations) {
    const merchantMemberships = user.merchants.map((membership) => ({
      id: membership.id,
      merchantId: membership.merchantId,
      merchantRole: membership.merchantRole,
      isOwner: membership.isOwner,
      permissions: membership.permissions,
      metadata: membership.metadata,
      createdAt: membership.createdAt,
      merchant: membership.merchant
        ? {
            id: membership.merchant.id,
            name: membership.merchant.name,
            email: membership.merchant.email,
            isActive: membership.merchant.isActive,
          }
        : null,
    }));

    // Type assertion for OAuth fields (after Prisma migration)
    const userWithOAuth = user as typeof user & {
      providerId?: string | null;
      provider?: string | null;
      avatar?: string | null;
    };

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      avatar: userWithOAuth.avatar || null,
      provider: userWithOAuth.provider || null,
      merchantIds: merchantMemberships.map((m) => m.merchantId),
      merchantMemberships,
      customerId: user.customer?.id ?? null,
      customer: user.customer
        ? {
            id: user.customer.id,
            email: user.customer.email,
            firstName: user.customer.firstName,
            lastName: user.customer.lastName,
            phone: user.customer.phone,
            isActive: user.customer.isActive,
          }
        : null,
    };
  }

  async verifyCredentials(email: string, password: string) {
    const userRecord = await this.prisma.user.findUnique({
      where: { email },
      include: profileInclude,
    });

    const user = userRecord as (UserWithRelations & { hashedPassword: string | null }) | null;

    if (!user || !user.hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      success: true,
      message: 'Credentials verified',
      data: this.formatUser(user as UserWithRelations),
    };
  }

  async registerUser(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const nameParts = (dto.name || '').trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || null;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

    const createData: UserCreateWithHash = {
      email: dto.email,
      hashedPassword,
      role: 'CUSTOMER',
      isActive: true,
      customer: {
        create: {
          email: dto.email,
          firstName,
          lastName,
          isActive: true,
        },
      },
    };

    const userRecord = await this.prisma.user.create<Prisma.UserCreateArgs>({
      data: createData,
      include: profileInclude,
    });

    const user = userRecord as UserWithRelations;

    return {
      success: true,
      message: 'Registration successful',
      data: this.formatUser(user),
    };
  }

  async getProfile(userId: string) {
    const userRecord = await this.prisma.user.findUnique({
      where: { id: userId },
      include: profileInclude,
    });

    if (!userRecord) {
      throw new UnauthorizedException('User not found');
    }

    return this.formatUser(userRecord as UserWithRelations);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedPassword) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.hashedPassword,
    );
    if (!passwordMatches) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be at least 8 characters',
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  /**
   * Find or create user from OAuth provider (Google, etc.)
   * Auto-links accounts if email already exists
   */
  async findOrCreateOAuthUser(dto: OAuthGoogleDto) {
    // Try to find by provider ID first (if account already linked)
    // Also check by email for auto-linking
    let userRecord = await this.prisma.user.findFirst({
      where: {
        OR: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { providerId: dto.providerId, provider: 'google' } as any,
          { email: dto.email }, // Auto-link: same email = same account
        ],
      },
      include: profileInclude,
    });

    // Parse name if provided
    const nameParts = dto.name
      ? dto.name.trim().split(/\s+/).filter(Boolean)
      : [];
    const firstName = dto.firstName || (nameParts[0] || null);
    const lastName =
      dto.lastName ||
      (nameParts.length > 1 ? nameParts.slice(1).join(' ') : null);

    if (userRecord) {
      // User exists - update OAuth info if not set (link Google account)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      let needsUpdate = false;

      // Type assertion for OAuth fields (Prisma client will be regenerated)
      const userWithOAuth = userRecord as UserWithRelations & {
        providerId?: string | null;
        provider?: string | null;
        avatar?: string | null;
      };

      if (!userWithOAuth.providerId) {
        updateData.providerId = dto.providerId;
        updateData.provider = 'google';
        needsUpdate = true;
      }

      if (dto.avatar && !userWithOAuth.avatar) {
        updateData.avatar = dto.avatar;
        needsUpdate = true;
      }

      // Create customer profile if it doesn't exist
      if (!userRecord.customer) {
        updateData.customer = {
          create: {
            email: dto.email,
            firstName,
            lastName,
            isActive: true,
          },
        };
        needsUpdate = true;
      } else {
        // Update customer name if not set
        const customerUpdate: Prisma.CustomerUpdateInput = {};
        if (!userRecord.customer.firstName && firstName) {
          customerUpdate.firstName = firstName;
        }
        if (!userRecord.customer.lastName && lastName) {
          customerUpdate.lastName = lastName;
        }
        if (Object.keys(customerUpdate).length > 0) {
          updateData.customer = { update: customerUpdate };
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        userRecord = await this.prisma.user.update({
          where: { id: userRecord.id },
          data: updateData,
          include: profileInclude,
        });
      }

      // Check if account is active
      if (!userRecord.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      return {
        success: true,
        message: 'User found and linked',
        data: this.formatUser(userRecord as UserWithRelations),
      };
    }

    // Create new user with OAuth
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createData: any = {
      email: dto.email,
      hashedPassword: null, // OAuth users don't have passwords
      providerId: dto.providerId,
      provider: 'google',
      avatar: dto.avatar || null,
      role: 'CUSTOMER',
      isActive: true,
      customer: {
        create: {
          email: dto.email,
          firstName,
          lastName,
          isActive: true,
        },
      },
    };

    userRecord = await this.prisma.user.create({
      data: createData,
      include: profileInclude,
    });

    return {
      success: true,
      message: 'OAuth user created successfully',
      data: this.formatUser(userRecord as UserWithRelations),
    };
  }
}