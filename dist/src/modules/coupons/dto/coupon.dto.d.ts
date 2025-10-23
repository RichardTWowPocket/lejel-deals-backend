import { CouponStatus } from '@prisma/client';
export declare class CouponResponseDto {
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
export declare class CouponValidationDto {
    qrCode: string;
}
export declare class CouponValidationResponseDto {
    isValid: boolean;
    coupon?: CouponResponseDto;
    error?: string;
}
export declare class RedeemCouponDto {
    qrCode: string;
    staffId?: string;
    notes?: string;
}
export declare class CancelCouponDto {
    reason?: string;
}
export declare class CouponStatsDto {
    totalCoupons: number;
    activeCoupons: number;
    usedCoupons: number;
    expiredCoupons: number;
    cancelledCoupons: number;
    totalRedemptions: number;
    redemptionRate: number;
}
export declare class GenerateQRCodeDto {
    couponId: string;
}
