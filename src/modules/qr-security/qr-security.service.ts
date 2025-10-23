import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

export interface QRCodePayload {
  couponId: string;
  orderId: string;
  dealId: string;
  customerId: string;
  merchantId: string;
  expiresAt: Date;
  issuedAt: Date;
  nonce: string;
}

export interface QRCodeValidationResult {
  isValid: boolean;
  payload?: QRCodePayload;
  error?: string;
  coupon?: any;
  order?: any;
  deal?: any;
  customer?: any;
  merchant?: any;
}

@Injectable()
export class QRCodeSecurityService {
  private readonly logger = new Logger(QRCodeSecurityService.name);
  private readonly qrSecret = process.env.QR_CODE_SECRET || 'qr-secret-key-change-in-production';
  private readonly qrExpirationHours = 24; // QR codes expire in 24 hours

  constructor(private prisma: PrismaService) {}

  /**
   * Generate a secure JWT-signed QR code for a coupon
   */
  async generateSecureQRCode(couponId: string): Promise<string> {
    try {
      // Get coupon details with related data
      const coupon = await this.prisma.coupon.findUnique({
        where: { id: couponId },
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
      });

      if (!coupon) {
        throw new BadRequestException('Coupon not found');
      }

      if (coupon.status !== 'ACTIVE') {
        throw new BadRequestException('Coupon is not active');
      }

      // Check if coupon has already been used
      if (coupon.usedAt) {
        throw new BadRequestException('Coupon has already been used');
      }

      // Check if coupon has expired
      if (new Date() > coupon.expiresAt) {
        throw new BadRequestException('Coupon has expired');
      }

      // Generate nonce for additional security
      const nonce = crypto.randomBytes(16).toString('hex');

      // Create QR code payload
      const payload: QRCodePayload = {
        couponId: coupon.id,
        orderId: coupon.orderId,
        dealId: coupon.dealId,
        customerId: coupon.order.customerId,
        merchantId: coupon.order.deal.merchantId,
        expiresAt: coupon.expiresAt,
        issuedAt: new Date(),
        nonce,
      };

      // Sign the payload with JWT
      const qrToken = jwt.sign(payload, this.qrSecret, {
        expiresIn: `${this.qrExpirationHours}h`,
        issuer: 'lejel-deals',
        audience: 'coupon-redemption',
      });

      // Log QR code generation
      await this.logQRActivity('GENERATED', couponId, {
        orderId: coupon.orderId,
        dealId: coupon.dealId,
        customerId: coupon.order.customerId,
        merchantId: coupon.order.deal.merchantId,
        nonce,
      });

      this.logger.log(`Secure QR code generated for coupon ${couponId}`);

      return qrToken;
    } catch (error) {
      this.logger.error(`Failed to generate QR code for coupon ${couponId}:`, error);
      throw error;
    }
  }

  /**
   * Validate and verify a QR code
   */
  async validateQRCode(qrToken: string, staffId?: string): Promise<QRCodeValidationResult> {
    try {
      // Verify JWT signature
      let payload: QRCodePayload;
      try {
        payload = jwt.verify(qrToken, this.qrSecret, {
          issuer: 'lejel-deals',
          audience: 'coupon-redemption',
        }) as QRCodePayload;
      } catch (jwtError) {
        await this.logQRActivity('INVALID_SIGNATURE', null, { error: jwtError.message });
        return {
          isValid: false,
          error: 'Invalid QR code signature',
        };
      }

      // Check if QR code has expired
      if (new Date() > payload.expiresAt) {
        await this.logQRActivity('EXPIRED', payload.couponId, { expiresAt: payload.expiresAt });
        return {
          isValid: false,
          error: 'QR code has expired',
        };
      }

      // Get coupon details
      const coupon = await this.prisma.coupon.findUnique({
        where: { id: payload.couponId },
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
      });

      if (!coupon) {
        await this.logQRActivity('COUPON_NOT_FOUND', payload.couponId);
        return {
          isValid: false,
          error: 'Coupon not found',
        };
      }

      // Check coupon status
      if (coupon.status !== 'ACTIVE') {
        await this.logQRActivity('INVALID_STATUS', payload.couponId, { status: coupon.status });
        return {
          isValid: false,
          error: `Coupon is ${coupon.status.toLowerCase()}`,
        };
      }

      // Check if coupon has already been used
      if (coupon.usedAt) {
        await this.logQRActivity('ALREADY_USED', payload.couponId, { usedAt: coupon.usedAt });
        return {
          isValid: false,
          error: 'Coupon has already been used',
        };
      }

      // Verify nonce matches (prevents replay attacks)
      if (payload.nonce !== coupon.qrCode) {
        await this.logQRActivity('INVALID_NONCE', payload.couponId, { 
          expected: coupon.qrCode, 
          received: payload.nonce 
        });
        return {
          isValid: false,
          error: 'Invalid QR code nonce',
        };
      }

      // Log successful validation
      await this.logQRActivity('VALIDATED', payload.couponId, { 
        staffId,
        orderId: payload.orderId,
        dealId: payload.dealId,
      });

      return {
        isValid: true,
        payload,
        coupon,
        order: coupon.order,
        deal: coupon.order.deal,
        customer: coupon.order.customer,
        merchant: coupon.order.deal.merchant,
      };
    } catch (error) {
      this.logger.error('QR code validation failed:', error);
      return {
        isValid: false,
        error: 'QR code validation failed',
      };
    }
  }

  /**
   * Mark QR code as used (single-use enforcement)
   */
  async markQRCodeAsUsed(couponId: string, staffId: string, notes?: string): Promise<void> {
    try {
      // Update coupon status
      await this.prisma.coupon.update({
        where: { id: couponId },
        data: {
          status: 'USED',
          usedAt: new Date(),
        },
      });

      // Create redemption record
      await this.prisma.redemption.create({
        data: {
          couponId,
          staffId,
          notes,
          redeemedAt: new Date(),
        },
      });

      // Log QR code usage
      await this.logQRActivity('REDEEMED', couponId, { 
        staffId,
        notes,
        redeemedAt: new Date(),
      });

      this.logger.log(`QR code redeemed for coupon ${couponId} by staff ${staffId}`);
    } catch (error) {
      this.logger.error(`Failed to mark QR code as used for coupon ${couponId}:`, error);
      throw error;
    }
  }

  /**
   * Revoke a QR code (invalidate it)
   */
  async revokeQRCode(couponId: string, reason: string): Promise<void> {
    try {
      // Update coupon status
      await this.prisma.coupon.update({
        where: { id: couponId },
        data: {
          status: 'CANCELLED',
        },
      });

      // Log QR code revocation
      await this.logQRActivity('REVOKED', couponId, { 
        reason,
        revokedAt: new Date(),
      });

      this.logger.log(`QR code revoked for coupon ${couponId}: ${reason}`);
    } catch (error) {
      this.logger.error(`Failed to revoke QR code for coupon ${couponId}:`, error);
      throw error;
    }
  }

  /**
   * Check QR code usage history
   */
  async getQRCodeHistory(couponId: string): Promise<any[]> {
    try {
      const activities = await this.prisma.qRCodeActivity.findMany({
        where: { couponId },
        orderBy: { createdAt: 'desc' },
      });

      return activities;
    } catch (error) {
      this.logger.error(`Failed to get QR code history for coupon ${couponId}:`, error);
      throw error;
    }
  }

  /**
   * Get QR code statistics
   */
  async getQRCodeStats(): Promise<any> {
    try {
      const [
        totalGenerated,
        totalValidated,
        totalRedeemed,
        totalExpired,
        totalRevoked,
        recentActivity,
      ] = await Promise.all([
        this.prisma.qRCodeActivity.count({ where: { action: 'GENERATED' } }),
        this.prisma.qRCodeActivity.count({ where: { action: 'VALIDATED' } }),
        this.prisma.qRCodeActivity.count({ where: { action: 'REDEEMED' } }),
        this.prisma.qRCodeActivity.count({ where: { action: 'EXPIRED' } }),
        this.prisma.qRCodeActivity.count({ where: { action: 'REVOKED' } }),
        this.prisma.qRCodeActivity.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
      ]);

      return {
        totalGenerated,
        totalValidated,
        totalRedeemed,
        totalExpired,
        totalRevoked,
        recentActivity,
        successRate: totalGenerated > 0 ? (totalRedeemed / totalGenerated) * 100 : 0,
        expirationRate: totalGenerated > 0 ? (totalExpired / totalGenerated) * 100 : 0,
      };
    } catch (error) {
      this.logger.error('Failed to get QR code stats:', error);
      throw error;
    }
  }

  /**
   * Log QR code activity for audit trail
   */
  private async logQRActivity(action: string, couponId: string | null, metadata?: any): Promise<void> {
    try {
      await this.prisma.qRCodeActivity.create({
        data: {
          action,
          couponId,
          metadata: metadata || {},
          timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Failed to log QR code activity:', error);
      // Don't throw error here as it's just logging
    }
  }

  /**
   * Clean up expired QR codes (cron job)
   */
  async cleanupExpiredQRCodes(): Promise<number> {
    try {
      const expiredCoupons = await this.prisma.coupon.findMany({
        where: {
          status: 'ACTIVE',
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      let cleanedCount = 0;
      for (const coupon of expiredCoupons) {
        await this.prisma.coupon.update({
          where: { id: coupon.id },
          data: { status: 'EXPIRED' },
        });

        await this.logQRActivity('AUTO_EXPIRED', coupon.id, {
          expiresAt: coupon.expiresAt,
          cleanedAt: new Date(),
        });

        cleanedCount++;
      }

      this.logger.log(`Cleaned up ${cleanedCount} expired QR codes`);
      return cleanedCount;
    } catch (error) {
      this.logger.error('Failed to cleanup expired QR codes:', error);
      throw error;
    }
  }
}
