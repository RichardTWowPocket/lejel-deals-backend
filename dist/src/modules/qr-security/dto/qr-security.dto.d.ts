export declare class GenerateQRCodeDto {
    couponId: string;
}
export declare class ValidateQRCodeDto {
    qrToken: string;
    staffId?: string;
}
export declare class RedeemQRCodeDto {
    qrToken: string;
    staffId: string;
    notes?: string;
}
export declare class RevokeQRCodeDto {
    couponId: string;
    reason: string;
}
export declare class QRCodeResponseDto {
    qrToken: string;
    expiresAt: Date;
    issuedAt: Date;
    coupon: {
        id: string;
        orderId: string;
        dealId: string;
        status: string;
        expiresAt: Date;
    };
    order: {
        id: string;
        orderNumber: string;
        customerId: string;
        totalAmount: number;
    };
    deal: {
        id: string;
        title: string;
        merchantId: string;
    };
    customer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    merchant: {
        id: string;
        name: string;
        email: string;
    };
}
export declare class QRCodeValidationResponseDto {
    isValid: boolean;
    error?: string;
    payload?: {
        couponId: string;
        orderId: string;
        dealId: string;
        customerId: string;
        merchantId: string;
        expiresAt: Date;
        issuedAt: Date;
        nonce: string;
    };
    coupon?: {
        id: string;
        orderId: string;
        dealId: string;
        status: string;
        expiresAt: Date;
        usedAt?: Date;
    };
    order?: {
        id: string;
        orderNumber: string;
        customerId: string;
        totalAmount: number;
        status: string;
    };
    deal?: {
        id: string;
        title: string;
        description: string;
        merchantId: string;
        discountPrice: number;
    };
    customer?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    merchant?: {
        id: string;
        name: string;
        email: string;
    };
}
export declare class QRCodeActivityDto {
    id: string;
    action: string;
    couponId?: string;
    metadata?: any;
    timestamp: Date;
    createdAt: Date;
}
export declare class QRCodeStatsDto {
    totalGenerated: number;
    totalValidated: number;
    totalRedeemed: number;
    totalExpired: number;
    totalRevoked: number;
    recentActivity: number;
    successRate: number;
    expirationRate: number;
}
export declare class QRCodeHistoryDto {
    activities: QRCodeActivityDto[];
    total: number;
}
