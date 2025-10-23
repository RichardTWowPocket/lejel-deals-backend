import { UserRole } from '@prisma/client';
export declare class RevenueAnalyticsDto {
    totalRevenue: number;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
        orders: number;
    }>;
    dailyRevenue: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
    averageOrderValue: number;
    revenueGrowth: number;
    topPerformingDeals: Array<{
        dealId: string;
        dealTitle: string;
        revenue: number;
        orders: number;
        merchantName: string;
    }>;
}
export declare class CustomerAnalyticsDto {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    customerGrowth: number;
    averageSpendingPerCustomer: number;
    customerRetentionRate: number;
    topCustomers: Array<{
        customerId: string;
        customerName: string;
        totalSpent: number;
        orders: number;
        lastOrderDate: Date;
    }>;
    customerSegments: {
        highValue: number;
        mediumValue: number;
        lowValue: number;
    };
}
export declare class MerchantAnalyticsDto {
    totalMerchants: number;
    activeMerchants: number;
    topPerformingMerchants: Array<{
        merchantId: string;
        merchantName: string;
        revenue: number;
        orders: number;
        deals: number;
        averageRating?: number;
    }>;
    merchantGrowth: number;
    averageRevenuePerMerchant: number;
    merchantPerformance: Array<{
        merchantId: string;
        merchantName: string;
        revenue: number;
        orders: number;
        conversionRate: number;
    }>;
}
export declare class DealAnalyticsDto {
    totalDeals: number;
    activeDeals: number;
    expiredDeals: number;
    dealPerformance: Array<{
        dealId: string;
        dealTitle: string;
        merchantName: string;
        category: string;
        couponValue: number;
        orders: number;
        revenue: number;
        conversionRate: number;
        views?: number;
    }>;
    categoryPerformance: Array<{
        categoryId: string;
        categoryName: string;
        deals: number;
        revenue: number;
        orders: number;
    }>;
    dealTrends: Array<{
        period: string;
        dealsCreated: number;
        dealsExpired: number;
        averageDiscount: number;
    }>;
}
export declare class OrderAnalyticsDto {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    orderTrends: Array<{
        period: string;
        orders: number;
        revenue: number;
        averageOrderValue: number;
    }>;
    orderStatusDistribution: {
        pending: number;
        paid: number;
        cancelled: number;
        refunded: number;
    };
    averageOrderProcessingTime: number;
    orderCompletionRate: number;
}
export declare class DashboardAnalyticsDto {
    overview: {
        totalRevenue: number;
        totalOrders: number;
        totalCustomers: number;
        totalMerchants: number;
        totalDeals: number;
        activeCoupons: number;
    };
    revenue: RevenueAnalyticsDto;
    customers: CustomerAnalyticsDto;
    merchants: MerchantAnalyticsDto;
    deals: DealAnalyticsDto;
    orders: OrderAnalyticsDto;
    lastUpdated: Date;
}
export declare class AnalyticsQueryDto {
    startDate?: string;
    endDate?: string;
    userRole?: UserRole;
    merchantId?: string;
    categoryId?: string;
}
