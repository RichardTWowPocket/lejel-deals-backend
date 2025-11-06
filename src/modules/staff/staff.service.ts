import { Injectable, Logger, NotFoundException, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  CreateStaffDto, 
  UpdateStaffDto, 
  StaffLoginDto, 
  StaffResponseDto, 
  StaffLoginResponseDto, 
  StaffStatsDto, 
  ChangePinDto, 
  StaffActivityDto,
  StaffRole,
  mapMerchantRoleToStaffRole,
  mapStaffRoleToMerchantRole,
} from './dto/staff.dto';
import { MerchantRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private readonly jwtExpiresIn = '8h'; // Staff tokens expire in 8 hours

  // Role hierarchy: OWNER > ADMIN > MANAGER > SUPERVISOR > CASHIER
  private readonly roleHierarchy: Record<MerchantRole, number> = {
    [MerchantRole.OWNER]: 5,
    [MerchantRole.ADMIN]: 4,
    [MerchantRole.MANAGER]: 3,
    [MerchantRole.SUPERVISOR]: 2,
    [MerchantRole.CASHIER]: 1,
  };

  constructor(private prisma: PrismaService) {}

  /**
   * Check if current user role can access staff with target role
   * Users can only see/manage staff with roles below their own
   */
  private canAccessStaffRole(currentUserRole: MerchantRole | undefined, targetStaffRole: MerchantRole): boolean {
    // If no current user role (shouldn't happen with guard, but safety check)
    if (!currentUserRole) {
      return false;
    }

    // OWNER and ADMIN can see all staff
    if (currentUserRole === MerchantRole.OWNER || currentUserRole === MerchantRole.ADMIN) {
      return true;
    }

    // MANAGER can only see SUPERVISOR and CASHIER
    if (currentUserRole === MerchantRole.MANAGER) {
      return (
        targetStaffRole === MerchantRole.SUPERVISOR ||
        targetStaffRole === MerchantRole.CASHIER
      );
    }

    // SUPERVISOR and CASHIER cannot manage other staff
    return false;
  }

  async create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto> {
    try {
      const merchantId = createStaffDto.merchantId;
      if (!merchantId) {
        throw new BadRequestException('Merchant ID is required');
      }

      // Check if user with this email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createStaffDto.email },
        include: {
          merchants: {
            where: { merchantId },
          },
        },
      });

      if (existingUser) {
        // Check if user already has membership for this merchant
        const existingMembership = existingUser.merchants.find(m => m.merchantId === merchantId);
        if (existingMembership) {
          throw new ConflictException('Staff with this email already exists for this merchant');
        }
      }

      // Hash the PIN
      const hashedPin = await bcrypt.hash(createStaffDto.pin, 10);

      // Prepare metadata for MerchantMembership
      const metadata: any = {
        pin: hashedPin,
        firstName: createStaffDto.firstName,
        lastName: createStaffDto.lastName,
        phone: createStaffDto.phone,
        lastLoginAt: null,
      };

      // Map StaffRole to MerchantRole
      const merchantRole = createStaffDto.role 
        ? mapStaffRoleToMerchantRole(createStaffDto.role)
        : MerchantRole.CASHIER;

      // Create or update user
      let user;
      if (existingUser) {
        user = existingUser;
      } else {
        user = await this.prisma.user.create({
          data: {
            email: createStaffDto.email,
            role: 'MERCHANT', // Staff members are merchants
            isActive: true,
          },
        });
      }

      // Create MerchantMembership
      const membership = await this.prisma.merchantMembership.create({
        data: {
          userId: user.id,
          merchantId,
          merchantRole,
          permissions: createStaffDto.permissions,
          metadata,
        },
        include: {
          user: true,
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Staff created: ${createStaffDto.email} (${merchantRole})`);

      return this.mapToResponseDto(membership, user);
    } catch (error) {
      this.logger.error('Failed to create staff:', error);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    merchantId?: string,
    role?: StaffRole,
    isActive?: boolean,
    currentUserRole?: MerchantRole,
  ): Promise<{ staff: StaffResponseDto[]; pagination: any }> {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (merchantId) {
        where.merchantId = merchantId;
      }

      // If current user is MANAGER, filter to only show SUPERVISOR and CASHIER
      if (currentUserRole === MerchantRole.MANAGER) {
        // If role filter is specified, check if it's allowed for MANAGER
      if (role) {
          const merchantRole = mapStaffRoleToMerchantRole(role);
          if (merchantRole !== MerchantRole.SUPERVISOR && merchantRole !== MerchantRole.CASHIER) {
            // MANAGER cannot see this role, return empty result
            return {
              staff: [],
              pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
              },
            };
          }
          where.merchantRole = merchantRole;
        } else {
          // No role filter, show only SUPERVISOR and CASHIER
          where.merchantRole = {
            in: [MerchantRole.SUPERVISOR, MerchantRole.CASHIER],
          };
        }
      } else if (role) {
        // For OWNER/ADMIN, apply role filter normally
        const merchantRole = mapStaffRoleToMerchantRole(role);
        where.merchantRole = merchantRole;
      }

      const [memberships, total] = await Promise.all([
        this.prisma.merchantMembership.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: true,
            merchant: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.merchantMembership.count({ where }),
      ]);

      // Filter by isActive if specified
      let filteredMemberships = memberships;
      if (isActive !== undefined) {
        filteredMemberships = memberships.filter(m => m.user.isActive === isActive);
      }

      // Additional role hierarchy filter (safety check)
      if (currentUserRole) {
        filteredMemberships = filteredMemberships.filter(m =>
          this.canAccessStaffRole(currentUserRole, m.merchantRole),
        );
      }

      const staffResponse = filteredMemberships.map(m => this.mapToResponseDto(m, m.user));

      return {
        staff: staffResponse,
        pagination: {
          page,
          limit,
          total: filteredMemberships.length,
          totalPages: Math.ceil(filteredMemberships.length / limit),
        },
      };
    } catch (error) {
      this.logger.error('Failed to find staff:', error);
      throw error;
    }
  }

  async findOne(id: string, currentUserRole?: MerchantRole): Promise<StaffResponseDto> {
    try {
      const membership = await this.prisma.merchantMembership.findUnique({
        where: { id },
        include: {
          user: true,
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!membership) {
        throw new NotFoundException('Staff not found');
      }

      // Check role hierarchy access
      if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
        throw new UnauthorizedException('You do not have permission to view this staff member');
      }

      return this.mapToResponseDto(membership, membership.user);
    } catch (error) {
      this.logger.error(`Failed to find staff ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<StaffResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          merchants: {
            include: {
              merchant: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!user || user.merchants.length === 0) {
        throw new NotFoundException('Staff not found');
      }

      // Return the first membership (if multiple, frontend can handle selection)
      const membership = user.merchants[0];
      return this.mapToResponseDto(membership, user);
    } catch (error) {
      this.logger.error(`Failed to find staff by email ${email}:`, error);
      throw error;
    }
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, currentUserRole?: MerchantRole): Promise<StaffResponseDto> {
    try {
      const membership = await this.prisma.merchantMembership.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!membership) {
        throw new NotFoundException('Staff not found');
      }

      // Check role hierarchy access
      if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
        throw new UnauthorizedException('You do not have permission to update this staff member');
      }

      // If updating role, check if new role is accessible
      if (updateStaffDto.role && currentUserRole) {
        const newMerchantRole = mapStaffRoleToMerchantRole(updateStaffDto.role);
        if (!this.canAccessStaffRole(currentUserRole, newMerchantRole)) {
          throw new UnauthorizedException('You do not have permission to assign this role');
        }
      }

      // Check if email is being changed and if it already exists
      if (updateStaffDto.email && updateStaffDto.email !== membership.user.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: updateStaffDto.email },
        });

        if (emailExists) {
          throw new ConflictException('User with this email already exists');
        }
      }

      // Update user if needed
      const userUpdateData: any = {};
      if (updateStaffDto.email) {
        userUpdateData.email = updateStaffDto.email;
      }
      if (updateStaffDto.isActive !== undefined) {
        userUpdateData.isActive = updateStaffDto.isActive;
      }

      if (Object.keys(userUpdateData).length > 0) {
        await this.prisma.user.update({
          where: { id: membership.userId },
          data: userUpdateData,
        });
      }

      // Update membership metadata
      const currentMetadata = (membership.metadata as any) || {};
      const updatedMetadata: any = {
        ...currentMetadata,
        firstName: updateStaffDto.firstName ?? currentMetadata.firstName,
        lastName: updateStaffDto.lastName ?? currentMetadata.lastName,
        phone: updateStaffDto.phone ?? currentMetadata.phone,
      };

      // Hash PIN if it's being updated
      if (updateStaffDto.pin) {
        updatedMetadata.pin = await bcrypt.hash(updateStaffDto.pin, 10);
      }

      // Update merchant role if staff role is being changed
      const membershipUpdateData: any = {
        metadata: updatedMetadata,
      };

      if (updateStaffDto.role) {
        membershipUpdateData.merchantRole = mapStaffRoleToMerchantRole(updateStaffDto.role);
      }

      if (updateStaffDto.permissions !== undefined) {
        membershipUpdateData.permissions = updateStaffDto.permissions;
      }

      const updatedMembership = await this.prisma.merchantMembership.update({
        where: { id },
        data: membershipUpdateData,
        include: {
          user: true,
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Staff updated: ${updatedMembership.user.email}`);

      return this.mapToResponseDto(updatedMembership, updatedMembership.user);
    } catch (error) {
      this.logger.error(`Failed to update staff ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const membership = await this.prisma.merchantMembership.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!membership) {
        throw new NotFoundException('Staff not found');
      }

      // Delete the membership (not the user, as they might have other memberships)
      await this.prisma.merchantMembership.delete({
        where: { id },
      });

      this.logger.log(`Staff deleted: ${membership.user.email}`);
    } catch (error) {
      this.logger.error(`Failed to delete staff ${id}:`, error);
      throw error;
    }
  }

  async login(loginDto: StaffLoginDto): Promise<StaffLoginResponseDto> {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.identifier },
        include: {
          merchants: {
            include: {
              merchant: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!user || !user.isActive || user.merchants.length === 0) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Find membership and verify PIN
      let validMembership: typeof user.merchants[0] | null = null;
      for (const membership of user.merchants) {
        const metadata = (membership.metadata as any) || {};
        const hashedPin = metadata.pin;

        if (hashedPin) {
          const isPinValid = await bcrypt.compare(loginDto.pin, hashedPin);
          if (isPinValid) {
            validMembership = membership;
            break;
          }
        }
      }

      if (!validMembership) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login in metadata
      const metadata = (validMembership.metadata as any) || {};
      metadata.lastLoginAt = new Date().toISOString();

      await this.prisma.merchantMembership.update({
        where: { id: validMembership.id },
        data: { metadata },
      });

      // Generate JWT token
      const payload = {
        sub: validMembership.id,
        email: user.email,
        role: mapMerchantRoleToStaffRole(validMembership.merchantRole),
        merchantId: validMembership.merchantId,
        type: 'staff',
      };

      const accessToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });

      this.logger.log(`Staff logged in: ${user.email}`);

      return {
        staff: this.mapToResponseDto(validMembership, user),
        accessToken,
        expiresIn: 8 * 60 * 60, // 8 hours in seconds
      };
    } catch (error) {
      this.logger.error('Staff login failed:', error);
      throw error;
    }
  }

  async changePin(id: string, changePinDto: ChangePinDto, currentUserRole?: MerchantRole): Promise<void> {
    try {
      const membership = await this.prisma.merchantMembership.findUnique({
        where: { id },
      });

      if (!membership) {
        throw new NotFoundException('Staff not found');
      }

      // Check role hierarchy access
      if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
        throw new UnauthorizedException('You do not have permission to change PIN for this staff member');
      }

      const metadata = (membership.metadata as any) || {};
      const currentPin = metadata.pin;

      if (!currentPin) {
        throw new BadRequestException('No PIN set for this staff member');
      }

      // Verify current PIN
      const isCurrentPinValid = await bcrypt.compare(changePinDto.currentPin, currentPin);
      if (!isCurrentPinValid) {
        throw new BadRequestException('Current PIN is incorrect');
      }

      // Hash new PIN
      const hashedNewPin = await bcrypt.hash(changePinDto.newPin, 10);

      // Update PIN in metadata
      metadata.pin = hashedNewPin;

      await this.prisma.merchantMembership.update({
        where: { id },
        data: { metadata },
      });

      this.logger.log(`Staff PIN changed: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to change PIN for staff ${id}:`, error);
      throw error;
    }
  }

  async deactivate(id: string, currentUserRole?: MerchantRole): Promise<StaffResponseDto> {
    try {
      const membership = await this.prisma.merchantMembership.findUnique({
        where: { id },
        include: {
          user: true,
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!membership) {
        throw new NotFoundException('Staff not found');
      }

      // Check role hierarchy access
      if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
        throw new UnauthorizedException('You do not have permission to deactivate this staff member');
      }

      // Deactivate the user
      await this.prisma.user.update({
        where: { id: membership.userId },
        data: { isActive: false },
      });

      // Refresh membership to get updated user data
      const updatedMembership = await this.prisma.merchantMembership.findUnique({
        where: { id },
        include: {
          user: true,
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!updatedMembership) {
        throw new NotFoundException('Staff not found');
      }

      this.logger.log(`Staff deactivated: ${membership.user.email}`);

      return this.mapToResponseDto(updatedMembership, updatedMembership.user);
    } catch (error) {
      this.logger.error(`Failed to deactivate staff ${id}:`, error);
      throw error;
    }
  }

  async activate(id: string, currentUserRole?: MerchantRole): Promise<StaffResponseDto> {
    try {
      const membership = await this.prisma.merchantMembership.findUnique({
        where: { id },
        include: {
          user: true,
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!membership) {
        throw new NotFoundException('Staff not found');
      }

      // Check role hierarchy access
      if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
        throw new UnauthorizedException('You do not have permission to activate this staff member');
      }

      // Activate the user
      await this.prisma.user.update({
        where: { id: membership.userId },
        data: { isActive: true },
      });

      // Refresh membership to get updated user data
      const updatedMembership = await this.prisma.merchantMembership.findUnique({
        where: { id },
        include: {
          user: true,
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!updatedMembership) {
        throw new NotFoundException('Staff not found');
      }

      this.logger.log(`Staff activated: ${membership.user.email}`);

      return this.mapToResponseDto(updatedMembership, updatedMembership.user);
    } catch (error) {
      this.logger.error(`Failed to activate staff ${id}:`, error);
      throw error;
    }
  }

  async getStats(): Promise<StaffStatsDto> {
    try {
      const [totalMemberships, activeMemberships, membershipsByRole, membershipsByMerchant] = await Promise.all([
        this.prisma.merchantMembership.count(),
        this.prisma.merchantMembership.count({
          where: {
            user: {
              isActive: true,
            },
          },
        }),
        this.prisma.merchantMembership.groupBy({
          by: ['merchantRole'],
          _count: { id: true },
        }),
        this.prisma.merchantMembership.groupBy({
          by: ['merchantId'],
          _count: { id: true },
        }),
      ]);

      // Get merchant names
      const merchantIds = membershipsByMerchant.map(m => m.merchantId);
      const merchants = await this.prisma.merchant.findMany({
        where: { id: { in: merchantIds } },
        select: { id: true, name: true },
      });

      const merchantMap = merchants.reduce((acc, merchant) => {
        acc[merchant.id] = merchant.name;
        return acc;
      }, {} as Record<string, string>);

      // Calculate role stats (mapping MerchantRole to StaffRole)
      const roleStats = {
        MANAGER: 0,
        CASHIER: 0,
        SUPERVISOR: 0,
        ADMIN: 0,
      };

      membershipsByRole.forEach(role => {
        const staffRole = mapMerchantRoleToStaffRole(role.merchantRole);
        roleStats[staffRole] = (roleStats[staffRole] || 0) + role._count.id;
      });

      // Get recent logins (last 24 hours) from metadata
      const allMemberships = await this.prisma.merchantMembership.findMany({
        include: { user: true },
      });

      const recentLogins = allMemberships.filter(m => {
        const metadata = (m.metadata as any) || {};
        const lastLogin = metadata.lastLoginAt;
        if (!lastLogin) return false;
        const lastLoginDate = new Date(lastLogin);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastLoginDate >= yesterday;
      }).length;

      // Get redemption stats (using redeemedByUserId instead of staffId)
      const redemptionStats = await this.prisma.redemption.groupBy({
        by: ['redeemedByUserId'],
        _count: { id: true },
        where: {
          redeemedByUserId: { not: null },
        },
      });

      // Get user names for redemption stats
      const userIds = redemptionStats.map(r => r.redeemedByUserId).filter((id): id is string => id !== null);
      const users = await this.prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, email: true },
      });

      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user.email;
        return acc;
      }, {} as Record<string, string>);

      // Get staff names from memberships
      const membershipIds = userIds.map(userId => {
        const membership = allMemberships.find(m => m.userId === userId);
        return membership?.id;
      }).filter((id): id is string => id !== null);

      const staffNames: Record<string, string> = {};
      allMemberships.forEach(m => {
        if (userIds.includes(m.userId)) {
          const metadata = (m.metadata as any) || {};
          const firstName = metadata.firstName || '';
          const lastName = metadata.lastName || '';
          staffNames[m.userId] = `${firstName} ${lastName}`.trim() || userMap[m.userId] || 'Unknown Staff';
        }
      });

      const totalRedemptions = redemptionStats.reduce((sum, stat) => sum + stat._count.id, 0);
      const averageRedemptionsPerStaff = activeMemberships > 0 ? totalRedemptions / activeMemberships : 0;

      const mostActiveStaff = redemptionStats
        .filter(stat => stat.redeemedByUserId !== null)
        .map(stat => ({
          staffId: stat.redeemedByUserId!,
          staffName: staffNames[stat.redeemedByUserId!] || 'Unknown Staff',
          redemptions: stat._count.id,
        }))
        .sort((a, b) => b.redemptions - a.redemptions)
        .slice(0, 5);

      return {
        totalStaff: totalMemberships,
        activeStaff: activeMemberships,
        staffByRole: roleStats,
        staffByMerchant: membershipsByMerchant.map(stat => ({
          merchantId: stat.merchantId,
          merchantName: merchantMap[stat.merchantId] || 'Unknown Merchant',
          staffCount: stat._count.id,
        })),
        recentLogins,
        activitySummary: {
          totalRedemptions,
          averageRedemptionsPerStaff,
          mostActiveStaff,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get staff stats:', error);
      throw error;
    }
  }

  async getStaffActivity(staffId: string, limit: number = 50): Promise<StaffActivityDto[]> {
    try {
      // Find the membership to get userId
      const membership = await this.prisma.merchantMembership.findUnique({
        where: { id: staffId },
        include: { user: true },
      });

      if (!membership) {
        throw new NotFoundException('Staff not found');
      }

      // Get redemptions by this user
      const redemptions = await this.prisma.redemption.findMany({
        where: { redeemedByUserId: membership.userId },
        take: limit,
        orderBy: { redeemedAt: 'desc' },
        include: {
          coupon: {
            include: {
              order: {
                include: {
                  customer: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                  deal: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return redemptions.map(redemption => ({
        activityType: 'REDEMPTION',
        description: `Redeemed coupon for ${redemption.coupon.order.deal.title} - Customer: ${redemption.coupon.order.customer.firstName || ''} ${redemption.coupon.order.customer.lastName || ''}`.trim(),
        entityId: redemption.couponId,
        metadata: {
          orderNumber: redemption.coupon.order.orderNumber,
          dealTitle: redemption.coupon.order.deal.title,
          notes: redemption.notes,
        },
        timestamp: redemption.redeemedAt,
      }));
    } catch (error) {
      this.logger.error(`Failed to get staff activity for ${staffId}:`, error);
      throw error;
    }
  }

  private mapToResponseDto(membership: any, user: any): StaffResponseDto {
    const metadata = (membership.metadata as any) || {};
    
    return {
      id: membership.id,
      firstName: metadata.firstName || '',
      lastName: metadata.lastName || '',
      email: user.email,
      phone: metadata.phone,
      role: mapMerchantRoleToStaffRole(membership.merchantRole),
      isActive: user.isActive,
      lastLoginAt: metadata.lastLoginAt ? new Date(metadata.lastLoginAt) : undefined,
      merchantId: membership.merchantId,
      merchant: membership.merchant,
      permissions: membership.permissions,
      metadata: membership.metadata,
      createdAt: membership.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}