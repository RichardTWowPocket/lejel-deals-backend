import { PrismaService } from '../../prisma/prisma.service';
import { CouponStatus } from '@prisma/client';
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
export declare class CouponsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, status?: CouponStatus, orderId?: string, dealId?: string): Promise<{
        coupons: CouponResponseDto[];
        pagination: any;
    }>;
    findOne(id: string): Promise<CouponResponseDto>;
    findByQRCode(qrCode: string): Promise<CouponResponseDto>;
    findByOrder(orderId: string): Promise<CouponResponseDto[]>;
    findMine(userId: string, page?: number, limit?: number, status?: CouponStatus): Promise<{
        coupons: CouponResponseDto[];
        pagination: any;
    }>;
    validateCoupon(qrCode: string): Promise<CouponValidationResult>;
    redeemCoupon(qrCode: string, staffId?: string, notes?: string): Promise<CouponResponseDto>;
    cancelCoupon(id: string, reason?: string): Promise<CouponResponseDto>;
    expireCoupons(): Promise<number>;
    getStats(): Promise<CouponStatsDto>;
    generateQRCodeData(couponId: string): Promise<string>;
    private mapToCouponResponseDto;
}
