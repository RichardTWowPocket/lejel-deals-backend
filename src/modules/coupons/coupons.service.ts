import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CouponStatus } from '@prisma/client';
import QRCode from 'qrcode';

export interface CouponResponseDto {
  id: string;
  orderId: string;
  dealId: string;
  qrCode: string;
  status: CouponStatus;
  usedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  order?: {
    orderNumber: string;
    customer: {
      firstName?: string;
      lastName?: string;
      email: string;
    };
  };
  deal?: {
    title: string;
    description?: string;
    merchant: {
      name: string;
    };
  };
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: CouponResponseDto;
  error?: string;
}

export interface CouponStatsDto {
  totalCoupons: number;
  activeCoupons: number;
  usedCoupons: number;
  expiredCoupons: number;
  cancelledCoupons: number;
  totalRedemptions: number;
  redemptionRate: number;
}

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: CouponStatus,
    orderId?: string,
    dealId?: string,
  ): Promise<{ coupons: CouponResponseDto[]; pagination: any }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (orderId) where.orderId = orderId;
    if (dealId) where.dealId = dealId;

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              orderNumber: true,
              customer: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          deal: {
            select: {
              id: true,
              title: true,
              description: true,
              dealPrice: true,
              discountPrice: true,
              images: true,
              validUntil: true,
              status: true,
              merchant: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      coupons: coupons.map((coupon) => this.mapToCouponResponseDto(coupon)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<CouponResponseDto> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            orderNumber: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            dealPrice: true,
            discountPrice: true,
            images: true,
            validUntil: true,
            status: true,
            merchant: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return this.mapToCouponResponseDto(coupon);
  }

  async findByQRCode(qrCode: string): Promise<CouponResponseDto> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { qrCode },
      include: {
        order: {
          select: {
            orderNumber: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            dealPrice: true,
            discountPrice: true,
            images: true,
            validUntil: true,
            status: true,
            merchant: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return this.mapToCouponResponseDto(coupon);
  }

  async findByOrder(orderId: string): Promise<CouponResponseDto[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: { orderId },
      include: {
        order: {
          select: {
            orderNumber: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            dealPrice: true,
            discountPrice: true,
            images: true,
            validUntil: true,
            status: true,
            merchant: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return coupons.map((coupon) => this.mapToCouponResponseDto(coupon));
  }

  async findMine(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: CouponStatus,
  ): Promise<{ coupons: CouponResponseDto[]; pagination: any }> {
    const customer = await this.prisma.customer.findFirst({
      where: { userId },
    });
    if (!customer) {
      return {
        coupons: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
    const skip = (page - 1) * limit;

    // Build where clause with optional status filter
    const where: any = { order: { customerId: customer.id } };
    if (status) {
      where.status = status;
    }

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              orderNumber: true,
              customer: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
          deal: {
            select: {
              id: true,
              title: true,
              description: true,
              dealPrice: true,
              discountPrice: true,
              images: true,
              validUntil: true,
              status: true,
              merchant: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.coupon.count({ where }),
    ]);
    return {
      coupons: coupons.map((c) => this.mapToCouponResponseDto(c)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async validateCoupon(qrCode: string): Promise<CouponValidationResult> {
    try {
      const coupon = await this.findByQRCode(qrCode);

      // Check if coupon is active
      if (coupon.status !== CouponStatus.ACTIVE) {
        return {
          isValid: false,
          error: `Coupon is ${coupon.status.toLowerCase()}`,
        };
      }

      // Check if coupon is expired
      if (new Date() > coupon.expiresAt) {
        return {
          isValid: false,
          error: 'Coupon has expired',
        };
      }

      // Check if coupon is already used
      if (coupon.usedAt) {
        return {
          isValid: false,
          error: 'Coupon has already been used',
        };
      }

      return {
        isValid: true,
        coupon,
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid coupon QR code',
      };
    }
  }

  async redeemCoupon(
    qrCode: string,
    redeemedByUserId?: string,
    notes?: string,
  ): Promise<CouponResponseDto> {
    // Validate coupon first
    const validation = await this.validateCoupon(qrCode);
    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    const coupon = validation.coupon!;

    // Update coupon status
    const updatedCoupon = await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        status: CouponStatus.USED,
        usedAt: new Date(),
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            dealPrice: true,
            discountPrice: true,
            images: true,
            validUntil: true,
            status: true,
            merchant: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    // Create redemption record
    await this.prisma.redemption.create({
      data: {
        couponId: coupon.id,
        redeemedByUserId: redeemedByUserId || null,
        notes,
      },
    });

    this.logger.log(`Coupon ${coupon.id} redeemed successfully`);

    return this.mapToCouponResponseDto(updatedCoupon);
  }

  async cancelCoupon(id: string, reason?: string): Promise<CouponResponseDto> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (coupon.status !== CouponStatus.ACTIVE) {
      throw new BadRequestException('Only active coupons can be cancelled');
    }

    const updatedCoupon = await this.prisma.coupon.update({
      where: { id },
      data: {
        status: CouponStatus.CANCELLED,
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            dealPrice: true,
            discountPrice: true,
            images: true,
            validUntil: true,
            status: true,
            merchant: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(
      `Coupon ${id} cancelled: ${reason || 'No reason provided'}`,
    );

    return this.mapToCouponResponseDto(updatedCoupon);
  }

  async expireCoupons(): Promise<number> {
    const now = new Date();

    const result = await this.prisma.coupon.updateMany({
      where: {
        status: CouponStatus.ACTIVE,
        expiresAt: {
          lt: now,
        },
      },
      data: {
        status: CouponStatus.EXPIRED,
      },
    });

    this.logger.log(`Expired ${result.count} coupons`);

    return result.count;
  }

  async getStats(): Promise<CouponStatsDto> {
    const [
      totalCoupons,
      activeCoupons,
      usedCoupons,
      expiredCoupons,
      cancelledCoupons,
      totalRedemptions,
    ] = await Promise.all([
      this.prisma.coupon.count(),
      this.prisma.coupon.count({ where: { status: CouponStatus.ACTIVE } }),
      this.prisma.coupon.count({ where: { status: CouponStatus.USED } }),
      this.prisma.coupon.count({ where: { status: CouponStatus.EXPIRED } }),
      this.prisma.coupon.count({ where: { status: CouponStatus.CANCELLED } }),
      this.prisma.redemption.count(),
    ]);

    const redemptionRate =
      totalCoupons > 0 ? (usedCoupons / totalCoupons) * 100 : 0;

    return {
      totalCoupons,
      activeCoupons,
      usedCoupons,
      expiredCoupons,
      cancelledCoupons,
      totalRedemptions,
      redemptionRate,
    };
  }

  async generateQRCodeData(couponId: string): Promise<string> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
      include: {
        order: {
          select: {
            orderNumber: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        deal: {
          select: {
            title: true,
            merchant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const qrData = {
      couponId: coupon.id,
      qrCode: coupon.qrCode,
      orderNumber: coupon.order.orderNumber,
      dealTitle: coupon.deal.title,
      merchantName: coupon.deal.merchant.name,
      customerName:
        `${coupon.order.customer.firstName || ''} ${coupon.order.customer.lastName || ''}`.trim(),
      expiresAt: coupon.expiresAt.toISOString(),
      status: coupon.status,
    };

    return await QRCode.toString(JSON.stringify(qrData), {
      type: 'utf8',
      errorCorrectionLevel: 'M',
    });
  }

  private mapToCouponResponseDto(coupon: any): CouponResponseDto {
    return {
      id: coupon.id,
      orderId: coupon.orderId,
      dealId: coupon.dealId,
      qrCode: coupon.qrCode,
      status: coupon.status,
      usedAt: coupon.usedAt,
      expiresAt: coupon.expiresAt,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
      order: coupon.order,
      deal: coupon.deal,
    };
  }
}
