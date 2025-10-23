import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';
export interface RevenueAnalytics {
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
export interface CustomerAnalytics {
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
export interface MerchantAnalytics {
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
export interface DealAnalytics {
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
export interface OrderAnalytics {
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
export interface DashboardAnalytics {
    overview: {
        totalRevenue: number;
        totalOrders: number;
        totalCustomers: number;
        totalMerchants: number;
        totalDeals: number;
        activeCoupons: number;
    };
    revenue: RevenueAnalytics;
    customers: CustomerAnalytics;
    merchants: MerchantAnalytics;
    deals: DealAnalytics;
    orders: OrderAnalytics;
    lastUpdated: Date;
}
export declare class AnalyticsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDashboardAnalytics(userRole: UserRole, userId?: string): Promise<DashboardAnalytics>;
    getRevenueAnalytics(userRole: UserRole, userId?: string): Promise<RevenueAnalytics>;
    getCustomerAnalytics(userRole: UserRole, userId?: string): Promise<CustomerAnalytics>;
    getMerchantAnalytics(userRole: UserRole, userId?: string): Promise<MerchantAnalytics>;
    getDealAnalytics(userRole: UserRole, userId?: string): Promise<DealAnalytics>;
    getOrderAnalytics(userRole: UserRole, userId?: string): Promise<OrderAnalytics>;
    private getOverviewMetrics;
    private buildWhereClause;
    private getMonthlyRevenue;
    private getDailyRevenue;
    private getTopPerformingDeals;
    private calculateRevenueGrowth;
    private calculateCustomerGrowth;
    private getTopCustomers;
    private calculateCustomerRetentionRate;
    private getCustomerSegments;
    private getTopPerformingMerchants;
    private calculateMerchantGrowth;
    private getMerchantPerformanceMetrics;
    private getDealPerformanceMetrics;
    private getCategoryPerformanceMetrics;
    private getDealTrends;
    private getOrderTrends;
    private calculateAverageOrderProcessingTime;
}
