import { OrderStatus } from '@prisma/client';
export declare class CreateOrderDto {
    customerId: string;
    dealId: string;
    quantity: number;
    paymentMethod?: string;
    paymentReference?: string;
}
export declare class UpdateOrderDto {
    status?: OrderStatus;
    paymentMethod?: string;
    paymentReference?: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    paymentReference?: string;
}
export declare class OrderResponseDto {
    id: string;
    orderNumber: string;
    customerId: string;
    dealId: string;
    quantity: number;
    totalAmount: number;
    status: OrderStatus;
    paymentMethod?: string;
    paymentReference?: string;
    createdAt: Date;
    updatedAt: Date;
    customer?: {
        id: string;
        firstName?: string;
        lastName?: string;
        email: string;
        phone?: string;
    };
    deal?: {
        id: string;
        title: string;
        description?: string;
        discountPrice: number;
        finalPrice: number;
        merchantId: string;
        merchant?: {
            id: string;
            name: string;
        };
    };
    coupons?: {
        id: string;
        qrCode: string;
        status: string;
        expiresAt: Date;
    }[];
}
export declare class OrderStatsDto {
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    statusDistribution: {
        [key in OrderStatus]: number;
    };
}
export declare class OrderAnalyticsDto {
    ordersByPeriod: Record<string, number>;
    revenueByPeriod: Record<string, number>;
    topCustomers: {
        customerId: string;
        customerName: string;
        orderCount: number;
        totalSpent: number;
    }[];
    topDeals: {
        dealId: string;
        dealTitle: string;
        orderCount: number;
        totalRevenue: number;
    }[];
    completionRate: number;
    averageTimeToPayment: number;
}
