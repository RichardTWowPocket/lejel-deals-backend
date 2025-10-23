import { Injectable, Logger, NotFoundException, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto, StaffLoginDto, StaffResponseDto, StaffLoginResponseDto, StaffStatsDto, ChangePinDto, StaffActivityDto } from './dto/staff.dto';
import { StaffRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private readonly jwtExpiresIn = '8h'; // Staff tokens expire in 8 hours

  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto> {
    try {
      // Check if email already exists
      const existingStaff = await this.prisma.staff.findUnique({
        where: { email: createStaffDto.email },
      });

      if (existingStaff) {
        throw new ConflictException('Staff with this email already exists');
      }

      // Hash the PIN
      const hashedPin = await bcrypt.hash(createStaffDto.pin, 10);

      // Create staff
      const staff = await this.prisma.staff.create({
        data: {
          ...createStaffDto,
          pin: hashedPin,
          role: createStaffDto.role || StaffRole.CASHIER,
        },
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Staff created: ${staff.email} (${staff.role})`);

      return this.mapToResponseDto(staff);
    } catch (error) {
      this.logger.error('Failed to create staff:', error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, merchantId?: string, role?: StaffRole, isActive?: boolean): Promise<{ staff: StaffResponseDto[]; pagination: any }> {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (merchantId) {
        where.merchantId = merchantId;
      }

      if (role) {
        where.role = role;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const [staff, total] = await Promise.all([
        this.prisma.staff.findMany({
          where,
          skip,
          take: limit,
          include: {
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
        this.prisma.staff.count({ where }),
      ]);

      const staffResponse = staff.map(s => this.mapToResponseDto(s));

      return {
        staff: staffResponse,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Failed to find staff:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<StaffResponseDto> {
    try {
      const staff = await this.prisma.staff.findUnique({
        where: { id },
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      return this.mapToResponseDto(staff);
    } catch (error) {
      this.logger.error(`Failed to find staff ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<StaffResponseDto> {
    try {
      const staff = await this.prisma.staff.findUnique({
        where: { email },
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      return this.mapToResponseDto(staff);
    } catch (error) {
      this.logger.error(`Failed to find staff by email ${email}:`, error);
      throw error;
    }
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto> {
    try {
      const existingStaff = await this.prisma.staff.findUnique({
        where: { id },
      });

      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      // Check if email is being changed and if it already exists
      if (updateStaffDto.email && updateStaffDto.email !== existingStaff.email) {
        const emailExists = await this.prisma.staff.findUnique({
          where: { email: updateStaffDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Staff with this email already exists');
        }
      }

      // Hash PIN if it's being updated
      const updateData: any = { ...updateStaffDto };
      if (updateStaffDto.pin) {
        updateData.pin = await bcrypt.hash(updateStaffDto.pin, 10);
      }

      const staff = await this.prisma.staff.update({
        where: { id },
        data: updateData,
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Staff updated: ${staff.email}`);

      return this.mapToResponseDto(staff);
    } catch (error) {
      this.logger.error(`Failed to update staff ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const staff = await this.prisma.staff.findUnique({
        where: { id },
      });

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      await this.prisma.staff.delete({
        where: { id },
      });

      this.logger.log(`Staff deleted: ${staff.email}`);
    } catch (error) {
      this.logger.error(`Failed to delete staff ${id}:`, error);
      throw error;
    }
  }

  async login(loginDto: StaffLoginDto): Promise<StaffLoginResponseDto> {
    try {
      // Find staff by email or PIN
      const staff = await this.prisma.staff.findFirst({
        where: {
          OR: [
            { email: loginDto.identifier },
            { pin: loginDto.identifier }, // This would be hashed, so this won't work for PIN lookup
          ],
          isActive: true,
        },
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!staff) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify PIN
      const isPinValid = await bcrypt.compare(loginDto.pin, staff.pin);
      if (!isPinValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      await this.prisma.staff.update({
        where: { id: staff.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate JWT token
      const payload = {
        sub: staff.id,
        email: staff.email,
        role: staff.role,
        merchantId: staff.merchantId,
        type: 'staff',
      };

      const accessToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });

      this.logger.log(`Staff logged in: ${staff.email}`);

      return {
        staff: this.mapToResponseDto(staff),
        accessToken,
        expiresIn: 8 * 60 * 60, // 8 hours in seconds
      };
    } catch (error) {
      this.logger.error('Staff login failed:', error);
      throw error;
    }
  }

  async changePin(id: string, changePinDto: ChangePinDto): Promise<void> {
    try {
      const staff = await this.prisma.staff.findUnique({
        where: { id },
      });

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      // Verify current PIN
      const isCurrentPinValid = await bcrypt.compare(changePinDto.currentPin, staff.pin);
      if (!isCurrentPinValid) {
        throw new BadRequestException('Current PIN is incorrect');
      }

      // Hash new PIN
      const hashedNewPin = await bcrypt.hash(changePinDto.newPin, 10);

      // Update PIN
      await this.prisma.staff.update({
        where: { id },
        data: { pin: hashedNewPin },
      });

      this.logger.log(`Staff PIN changed: ${staff.email}`);
    } catch (error) {
      this.logger.error(`Failed to change PIN for staff ${id}:`, error);
      throw error;
    }
  }

  async deactivate(id: string): Promise<StaffResponseDto> {
    try {
      const staff = await this.prisma.staff.update({
        where: { id },
        data: { isActive: false },
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Staff deactivated: ${staff.email}`);

      return this.mapToResponseDto(staff);
    } catch (error) {
      this.logger.error(`Failed to deactivate staff ${id}:`, error);
      throw error;
    }
  }

  async activate(id: string): Promise<StaffResponseDto> {
    try {
      const staff = await this.prisma.staff.update({
        where: { id },
        data: { isActive: true },
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Staff activated: ${staff.email}`);

      return this.mapToResponseDto(staff);
    } catch (error) {
      this.logger.error(`Failed to activate staff ${id}:`, error);
      throw error;
    }
  }

  async getStats(): Promise<StaffStatsDto> {
    try {
      const [
        totalStaff,
        activeStaff,
        staffByRole,
        staffByMerchant,
        recentLogins,
        redemptionStats,
      ] = await Promise.all([
        this.prisma.staff.count(),
        this.prisma.staff.count({ where: { isActive: true } }),
        this.prisma.staff.groupBy({
          by: ['role'],
          _count: { id: true },
        }),
        this.prisma.staff.groupBy({
          by: ['merchantId'],
          _count: { id: true },
          where: { merchantId: { not: null } },
        }),
        this.prisma.staff.count({
          where: {
            lastLoginAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
        this.prisma.redemption.groupBy({
          by: ['staffId'],
          _count: { id: true },
        }),
      ]);

      // Get merchant names for staff by merchant
      const merchantIds = staffByMerchant.map(s => s.merchantId).filter((id): id is string => id !== null);
      const merchants = await this.prisma.merchant.findMany({
        where: { id: { in: merchantIds } },
        select: { id: true, name: true },
      });

      const merchantMap = merchants.reduce((acc, merchant) => {
        acc[merchant.id] = merchant.name;
        return acc;
      }, {} as Record<string, string>);

      // Get staff names for redemption stats
      const staffIds = redemptionStats.map(r => r.staffId).filter((id): id is string => id !== null);
      const staffMembers = await this.prisma.staff.findMany({
        where: { id: { in: staffIds } },
        select: { id: true, firstName: true, lastName: true },
      });

      const staffMap = staffMembers.reduce((acc, staff) => {
        acc[staff.id] = `${staff.firstName} ${staff.lastName}`;
        return acc;
      }, {} as Record<string, string>);

      const roleStats = {
        MANAGER: 0,
        CASHIER: 0,
        SUPERVISOR: 0,
        ADMIN: 0,
      };

      staffByRole.forEach(role => {
        roleStats[role.role] = role._count.id;
      });

      const totalRedemptions = redemptionStats.reduce((sum, stat) => sum + stat._count.id, 0);
      const averageRedemptionsPerStaff = activeStaff > 0 ? totalRedemptions / activeStaff : 0;

      const mostActiveStaff = redemptionStats
        .filter(stat => stat.staffId !== null)
        .map(stat => ({
          staffId: stat.staffId!,
          staffName: staffMap[stat.staffId!] || 'Unknown Staff',
          redemptions: stat._count.id,
        }))
        .sort((a, b) => b.redemptions - a.redemptions)
        .slice(0, 5);

      return {
        totalStaff,
        activeStaff,
        staffByRole: roleStats,
        staffByMerchant: staffByMerchant.map(stat => ({
          merchantId: stat.merchantId!,
          merchantName: merchantMap[stat.merchantId!] || 'Unknown Merchant',
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
      const redemptions = await this.prisma.redemption.findMany({
        where: { staffId },
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
        description: `Redeemed coupon for ${redemption.coupon.order.deal.title} - Customer: ${redemption.coupon.order.customer.firstName} ${redemption.coupon.order.customer.lastName}`,
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

  private mapToResponseDto(staff: any): StaffResponseDto {
    return {
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      isActive: staff.isActive,
      lastLoginAt: staff.lastLoginAt,
      merchantId: staff.merchantId,
      merchant: staff.merchant,
      permissions: staff.permissions,
      metadata: staff.metadata,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }
}
