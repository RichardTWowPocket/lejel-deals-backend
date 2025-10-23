export declare class CustomerStatsDto {
    customerId: string;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
    firstOrderDate?: Date;
    activeDeals: number;
    usedDeals: number;
    favoriteCategories: string[];
    tier: string;
    loyaltyPoints: number;
    registrationDate: Date;
    daysSinceLastOrder: number;
    totalSavings: number;
}
