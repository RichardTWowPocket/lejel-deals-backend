import { AnalyticsService } from './analytics.service';
import { DashboardAnalyticsDto, RevenueAnalyticsDto, CustomerAnalyticsDto, MerchantAnalyticsDto, DealAnalyticsDto, OrderAnalyticsDto, AnalyticsQueryDto } from './dto/analytics.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardAnalytics(req: any, query: AnalyticsQueryDto): Promise<DashboardAnalyticsDto>;
    getRevenueAnalytics(req: any, query: AnalyticsQueryDto): Promise<RevenueAnalyticsDto>;
    getCustomerAnalytics(req: any, query: AnalyticsQueryDto): Promise<CustomerAnalyticsDto>;
    getMerchantAnalytics(req: any, query: AnalyticsQueryDto): Promise<MerchantAnalyticsDto>;
    getDealAnalytics(req: any, query: AnalyticsQueryDto): Promise<DealAnalyticsDto>;
    getOrderAnalytics(req: any, query: AnalyticsQueryDto): Promise<OrderAnalyticsDto>;
    getOverviewMetrics(req: any, query: AnalyticsQueryDto): Promise<any>;
    getBusinessTrends(req: any, query: AnalyticsQueryDto): Promise<any>;
    getPerformanceMetrics(req: any, query: AnalyticsQueryDto): Promise<any>;
}
