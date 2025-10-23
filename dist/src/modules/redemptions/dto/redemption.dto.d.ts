import { RedemptionStatus } from '@prisma/client';
export declare class CreateRedemptionDto {
    qrToken: string;
    staffId: string;
    notes?: string;
    location?: string;
}
export declare class UpdateRedemptionDto {
    status?: RedemptionStatus;
    notes?: string;
    location?: string;
}
export declare class RedemptionResponseDto {
    id: string;
    couponId: string;
    staffId: string;
    notes?: string;
    location?: string;
    status: RedemptionStatus;
    redeemedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    metadata?: any;
    coupon: {
        id: string;
        orderId: string;
        dealId: string;
        status: string;
        expiresAt: Date;
        usedAt?: Date;
    };
    order: {
        id: string;
        orderNumber: string;
        customerId: string;
        totalAmount: number;
        status: string;
    };
    deal: {
        id: string;
        title: string;
        description: string;
        merchantId: string;
        discountPrice: number;
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
    staff: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}
export declare class RedemptionStatsDto {
    totalRedemptions: number;
    completedRedemptions: number;
    pendingRedemptions: number;
    cancelledRedemptions: number;
    completionRate: number;
    redemptionsByStaff: Array<{
        staffId: string;
        staffName: string;
        redemptionCount: number;
    }>;
    recentRedemptions: number;
    averageRedemptionTime?: Date;
    statusDistribution: {
        completed: number;
        pending: number;
        cancelled: number;
    };
}
export declare class RedemptionAnalyticsDto {
    dailyRedemptions: Array<{
        date: string;
        count: number;
    }>;
    hourlyRedemptions: Array<{
        hour: number;
        count: number;
    }>;
    topPerformingStaff: Array<{
        staffId: string;
        staffName: string;
        redemptionCount: number;
    }>;
    redemptionTrends: Array<{
        date: Date;
        status: string;
    }>;
    customerRedemptions: Array<{
        customerId: string;
        customerName: string;
        redemptionCount: number;
    }>;
    summary: {
        totalRedemptions: number;
        averageDailyRedemptions: number;
        peakHour?: {
            hour: number;
            count: number;
        };
        topStaff?: {
            staffId: string;
            staffName: string;
            redemptionCount: number;
        };
    };
}
export declare class RedemptionValidationDto {
    isValid: boolean;
    error?: string;
    canRedeem: boolean;
    coupon?: {
        id: string;
        orderId: string;
        dealId: string;
        status: string;
        expiresAt: Date;
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
    staff?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
    validationTimestamp?: Date;
}
export declare class RedemptionFiltersDto {
    page?: number;
    limit?: number;
    merchantId?: string;
    staffId?: string;
    status?: RedemptionStatus;
    startDate?: Date;
    endDate?: Date;
}
