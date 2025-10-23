import { Injectable, Logger, NotFoundException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QRCodeSecurityService } from '../qr-security/qr-security.service';
import { CreateRedemptionDto, UpdateRedemptionDto, RedemptionResponseDto, RedemptionStatsDto, RedemptionAnalyticsDto, RedemptionValidationDto } from './dto/redemption.dto';
import { RedemptionStatus } from '@prisma/client';

@Injectable()
export class RedemptionService {
  private readonly logger = new Logger(RedemptionService.name);

  constructor(
    private prisma: PrismaService,
    private qrSecurityService: QRCodeSecurityService,
  ) {}

  /**
   * Process a redemption with comprehensive validation and staff integration
   */
  async processRedemption(
    qrToken: string,
    staffId: string,
    notes?: string,
    location?: string,
  ): Promise<RedemptionResponseDto> {
    try {
      // Validate QR code using security service
      const qrValidation = await this.qrSecurityService.validateQRCode(qrToken, staffId);
      
      if (!qrValidation.isValid) {
        throw new BadRequestException(qrValidation.error || 'Invalid QR code');
      }

      // Get staff information
      const staff = await this.prisma.staff.findUnique({
        where: { id: staffId },
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
        throw new NotFoundException('Staff member not found');
      }

      if (!staff.isActive) {
        throw new ForbiddenException('Staff member is not active');
      }

      // Check merchant scoping - staff can only redeem coupons for their assigned merchant
      if (staff.merchantId && staff.merchantId !== qrValidation.merchant!.id) {
        throw new ForbiddenException('Staff can only redeem coupons for their assigned merchant');
      }

      // Check if coupon has already been redeemed
      const existingRedemption = await this.prisma.redemption.findFirst({
        where: { couponId: qrValidation.payload!.couponId },
      });

      if (existingRedemption) {
        throw new BadRequestException('Coupon has already been redeemed');
      }

      // Create redemption record
      const redemption = await this.prisma.redemption.create({
        data: {
          couponId: qrValidation.payload!.couponId,
          staffId: staffId,
          notes: notes || null,
          location: location || null,
          status: RedemptionStatus.COMPLETED,
          redeemedAt: new Date(),
          metadata: {
            qrToken: qrToken.substring(0, 20) + '...', // Store partial token for audit
            validationTimestamp: new Date(),
            staffRole: staff.role,
            merchantId: staff.merchantId,
          },
        },
        include: {
          coupon: {
            include: {
              order: {
                include: {
                  customer: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                  deal: {
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
              },
            },
          },
          staff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Mark QR code as used in security service
      await this.qrSecurityService.markQRCodeAsUsed(
        qrValidation.payload!.couponId,
        staffId,
        notes,
      );

      // Update coupon status
      await this.prisma.coupon.update({
        where: { id: qrValidation.payload!.couponId },
        data: {
          status: 'USED',
          usedAt: new Date(),
        },
      });

      this.logger.log(`Redemption processed: ${redemption.id} by staff ${staffId}`);

      return this.mapToResponseDto(redemption);
    } catch (error) {
      this.logger.error('Failed to process redemption:', error);
      throw error;
    }
  }

  /**
   * Get redemption by ID with comprehensive details
   */
  async findOne(id: string): Promise<RedemptionResponseDto> {
    try {
      const redemption = await this.prisma.redemption.findUnique({
        where: { id },
        include: {
          coupon: {
            include: {
              order: {
                include: {
                  customer: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                  deal: {
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
              },
            },
          },
          staff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!redemption) {
        throw new NotFoundException('Redemption not found');
      }

      return this.mapToResponseDto(redemption);
    } catch (error) {
      this.logger.error(`Failed to find redemption ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get paginated list of redemptions with filtering
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    merchantId?: string,
    staffId?: string,
    status?: RedemptionStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ redemptions: RedemptionResponseDto[]; pagination: any }> {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (merchantId) {
        where.coupon = {
          order: {
            deal: {
              merchantId: merchantId,
            },
          },
        };
      }

      if (staffId) {
        where.staffId = staffId;
      }

      if (status) {
        where.status = status;
      }

      if (startDate || endDate) {
        where.redeemedAt = {};
        if (startDate) where.redeemedAt.gte = startDate;
        if (endDate) where.redeemedAt.lte = endDate;
      }

      const [redemptions, total] = await Promise.all([
        this.prisma.redemption.findMany({
          where,
          skip,
          take: limit,
          include: {
            coupon: {
              include: {
                order: {
                  include: {
                    customer: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                    deal: {
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
                },
              },
            },
            staff: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            redeemedAt: 'desc',
          },
        }),
        this.prisma.redemption.count({ where }),
      ]);

      const redemptionsResponse = redemptions.map(r => this.mapToResponseDto(r));

      return {
        redemptions: redemptionsResponse,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Failed to find redemptions:', error);
      throw error;
    }
  }

  /**
   * Update redemption status
   */
  async updateStatus(
    id: string,
    status: RedemptionStatus,
    notes?: string,
  ): Promise<RedemptionResponseDto> {
    try {
      const redemption = await this.prisma.redemption.findUnique({
        where: { id },
      });

      if (!redemption) {
        throw new NotFoundException('Redemption not found');
      }

      const updatedRedemption = await this.prisma.redemption.update({
        where: { id },
        data: {
          status,
          notes: notes || redemption.notes,
          updatedAt: new Date(),
        },
        include: {
          coupon: {
            include: {
              order: {
                include: {
                  customer: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                  deal: {
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
              },
            },
          },
          staff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      this.logger.log(`Redemption status updated: ${id} to ${status}`);

      return this.mapToResponseDto(updatedRedemption);
    } catch (error) {
      this.logger.error(`Failed to update redemption status ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get redemption statistics
   */
  async getRedemptionStats(merchantId?: string): Promise<RedemptionStatsDto> {
    try {
      const where: any = {};
      if (merchantId) {
        where.coupon = {
          order: {
            deal: {
              merchantId: merchantId,
            },
          },
        };
      }

      const [
        totalRedemptions,
        completedRedemptions,
        pendingRedemptions,
        cancelledRedemptions,
        redemptionsByStaff,
        redemptionsByMerchant,
        recentRedemptions,
      ] = await Promise.all([
        this.prisma.redemption.count({ where }),
        this.prisma.redemption.count({ where: { ...where, status: RedemptionStatus.COMPLETED } }),
        this.prisma.redemption.count({ where: { ...where, status: RedemptionStatus.PENDING } }),
        this.prisma.redemption.count({ where: { ...where, status: RedemptionStatus.CANCELLED } }),
        this.prisma.redemption.groupBy({
          by: ['staffId'],
          _count: { id: true },
          where,
        }),
        this.prisma.redemption.groupBy({
          by: ['couponId'],
          _count: { id: true },
          where,
        }),
        this.prisma.redemption.count({
          where: {
            ...where,
            redeemedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
      ]);

      // Get staff names for redemption stats
      const staffIds = redemptionsByStaff.map(r => r.staffId).filter((id): id is string => id !== null);
      const staffMembers = await this.prisma.staff.findMany({
        where: { id: { in: staffIds } },
        select: { id: true, firstName: true, lastName: true, role: true },
      });

      const staffMap = staffMembers.reduce((acc, staff) => {
        acc[staff.id] = `${staff.firstName} ${staff.lastName} (${staff.role})`;
        return acc;
      }, {} as Record<string, string>);

      return {
        totalRedemptions,
        completedRedemptions,
        pendingRedemptions,
        cancelledRedemptions,
        completionRate: totalRedemptions > 0 ? (completedRedemptions / totalRedemptions) * 100 : 0,
        redemptionsByStaff: redemptionsByStaff.map(stat => ({
          staffId: stat.staffId!,
          staffName: staffMap[stat.staffId!] || 'Unknown Staff',
          redemptionCount: stat._count.id,
        })),
        recentRedemptions,
        averageRedemptionTime: undefined, // Removed problematic aggregation
        statusDistribution: {
          completed: completedRedemptions,
          pending: pendingRedemptions,
          cancelled: cancelledRedemptions,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get redemption stats:', error);
      throw error;
    }
  }

  /**
   * Get redemption analytics
   */
  async getRedemptionAnalytics(
    merchantId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<RedemptionAnalyticsDto> {
    try {
      const where: any = {};
      if (merchantId) {
        where.coupon = {
          order: {
            deal: {
              merchantId: merchantId,
            },
          },
        };
      }

      if (startDate || endDate) {
        where.redeemedAt = {};
        if (startDate) where.redeemedAt.gte = startDate;
        if (endDate) where.redeemedAt.lte = endDate;
      }

      const [
        dailyRedemptions,
        hourlyRedemptions,
        topPerformingStaff,
        redemptionTrends,
        customerRedemptions,
      ] = await Promise.all([
        this.getDailyRedemptions(where),
        this.getHourlyRedemptions(where),
        this.getTopPerformingStaff(where),
        this.getRedemptionTrends(where),
        this.getCustomerRedemptions(where),
      ]);

      return {
        dailyRedemptions,
        hourlyRedemptions,
        topPerformingStaff,
        redemptionTrends,
        customerRedemptions,
        summary: {
          totalRedemptions: dailyRedemptions.reduce((sum, day) => sum + day.count, 0),
          averageDailyRedemptions: dailyRedemptions.length > 0 ? dailyRedemptions.reduce((sum, day) => sum + day.count, 0) / dailyRedemptions.length : 0,
          peakHour: hourlyRedemptions.length > 0 ? hourlyRedemptions.reduce((max, hour) => hour.count > max.count ? hour : max) : null,
          topStaff: topPerformingStaff.length > 0 ? topPerformingStaff[0] : null,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get redemption analytics:', error);
      throw error;
    }
  }

  /**
   * Validate redemption before processing
   */
  async validateRedemption(qrToken: string, staffId: string): Promise<RedemptionValidationDto> {
    try {
      // Validate QR code
      const qrValidation = await this.qrSecurityService.validateQRCode(qrToken, staffId);
      
      if (!qrValidation.isValid) {
        return {
          isValid: false,
          error: qrValidation.error || 'Invalid QR code',
          canRedeem: false,
        };
      }

      // Check staff permissions
      const staff = await this.prisma.staff.findUnique({
        where: { id: staffId },
      });

      if (!staff || !staff.isActive) {
        return {
          isValid: false,
          error: 'Staff member not found or inactive',
          canRedeem: false,
        };
      }

      // Check merchant scoping
      const canRedeem = !staff.merchantId || staff.merchantId === qrValidation.merchant!.id;

      return {
        isValid: true,
        canRedeem,
        coupon: qrValidation.coupon,
        order: qrValidation.order,
        deal: qrValidation.deal,
        customer: qrValidation.customer,
        merchant: qrValidation.merchant,
        staff: staff,
        validationTimestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to validate redemption:', error);
      return {
        isValid: false,
        error: 'Validation failed',
        canRedeem: false,
      };
    }
  }

  /**
   * Get daily redemption statistics
   */
  private async getDailyRedemptions(where: any): Promise<any[]> {
    const redemptions = await this.prisma.redemption.findMany({
      where,
      select: {
        redeemedAt: true,
      },
    });

    const dailyStats = redemptions.reduce((acc, redemption) => {
      const date = redemption.redeemedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyStats).map(([date, count]) => ({
      date,
      count,
    }));
  }

  /**
   * Get hourly redemption statistics
   */
  private async getHourlyRedemptions(where: any): Promise<any[]> {
    const redemptions = await this.prisma.redemption.findMany({
      where,
      select: {
        redeemedAt: true,
      },
    });

    const hourlyStats = redemptions.reduce((acc, redemption) => {
      const hour = redemption.redeemedAt.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(hourlyStats).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }));
  }

  /**
   * Get top performing staff
   */
  private async getTopPerformingStaff(where: any): Promise<any[]> {
    const staffStats = await this.prisma.redemption.groupBy({
      by: ['staffId'],
      _count: { id: true },
      where,
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    const staffIds = staffStats.map(s => s.staffId).filter((id): id is string => id !== null);
    const staffMembers = await this.prisma.staff.findMany({
      where: { id: { in: staffIds } },
      select: { id: true, firstName: true, lastName: true, role: true },
    });

    const staffMap = staffMembers.reduce((acc, staff) => {
      acc[staff.id] = `${staff.firstName} ${staff.lastName}`;
      return acc;
    }, {} as Record<string, string>);

    return staffStats.map(stat => ({
      staffId: stat.staffId!,
      staffName: staffMap[stat.staffId!] || 'Unknown Staff',
      redemptionCount: stat._count.id,
    }));
  }

  /**
   * Get redemption trends
   */
  private async getRedemptionTrends(where: any): Promise<any[]> {
    // This would typically involve more complex trend analysis
    // For now, return basic trend data
    const redemptions = await this.prisma.redemption.findMany({
      where,
      select: {
        redeemedAt: true,
      },
      orderBy: {
        redeemedAt: 'asc',
      },
    });

    return redemptions.map(redemption => ({
      date: redemption.redeemedAt,
      status: 'COMPLETED', // Default status since we removed it from select
    }));
  }

  /**
   * Get customer redemption statistics
   */
  private async getCustomerRedemptions(where: any): Promise<any[]> {
    const customerStats = await this.prisma.redemption.groupBy({
      by: ['couponId'],
      _count: { id: true },
      where,
    });

    // Get customer information from coupons
    const couponIds = customerStats.map(c => c.couponId);
    const coupons = await this.prisma.coupon.findMany({
      where: { id: { in: couponIds } },
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const customerMap = coupons.reduce((acc, coupon) => {
      const customerId = coupon.order.customerId;
      if (!acc[customerId]) {
        acc[customerId] = {
          customerId,
          customerName: `${coupon.order.customer.firstName} ${coupon.order.customer.lastName}`,
          redemptionCount: 0,
        };
      }
      acc[customerId].redemptionCount += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(customerMap);
  }

  /**
   * Map redemption to response DTO
   */
  private mapToResponseDto(redemption: any): RedemptionResponseDto {
    return {
      id: redemption.id,
      couponId: redemption.couponId,
      staffId: redemption.staffId,
      notes: redemption.notes,
      location: redemption.location,
      status: redemption.status,
      redeemedAt: redemption.redeemedAt,
      createdAt: redemption.createdAt,
      updatedAt: redemption.updatedAt,
      metadata: redemption.metadata,
      coupon: {
        id: redemption.coupon.id,
        orderId: redemption.coupon.orderId,
        dealId: redemption.coupon.dealId,
        status: redemption.coupon.status,
        expiresAt: redemption.coupon.expiresAt,
        usedAt: redemption.coupon.usedAt,
      },
      order: {
        id: redemption.coupon.order.id,
        orderNumber: redemption.coupon.order.orderNumber,
        customerId: redemption.coupon.order.customerId,
        totalAmount: Number(redemption.coupon.order.totalAmount),
        status: redemption.coupon.order.status,
      },
      deal: {
        id: redemption.coupon.order.deal.id,
        title: redemption.coupon.order.deal.title,
        description: redemption.coupon.order.deal.description,
        merchantId: redemption.coupon.order.deal.merchantId,
        discountPrice: Number(redemption.coupon.order.deal.discountPrice),
      },
      customer: {
        id: redemption.coupon.order.customer.id,
        firstName: redemption.coupon.order.customer.firstName,
        lastName: redemption.coupon.order.customer.lastName,
        email: redemption.coupon.order.customer.email,
      },
      merchant: {
        id: redemption.coupon.order.deal.merchant.id,
        name: redemption.coupon.order.deal.merchant.name,
        email: redemption.coupon.order.deal.merchant.email,
      },
      staff: {
        id: redemption.staff.id,
        firstName: redemption.staff.firstName,
        lastName: redemption.staff.lastName,
        email: redemption.staff.email,
        role: redemption.staff.role,
      },
    };
  }
}
