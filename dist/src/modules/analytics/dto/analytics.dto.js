"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsQueryDto = exports.DashboardAnalyticsDto = exports.OrderAnalyticsDto = exports.DealAnalyticsDto = exports.MerchantAnalyticsDto = exports.CustomerAnalyticsDto = exports.RevenueAnalyticsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class RevenueAnalyticsDto {
    totalRevenue;
    monthlyRevenue;
    dailyRevenue;
    averageOrderValue;
    revenueGrowth;
    topPerformingDeals;
}
exports.RevenueAnalyticsDto = RevenueAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total revenue', example: 5000000 }),
    __metadata("design:type", Number)
], RevenueAnalyticsDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monthly revenue data', type: 'array' }),
    __metadata("design:type", Array)
], RevenueAnalyticsDto.prototype, "monthlyRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Daily revenue data', type: 'array' }),
    __metadata("design:type", Array)
], RevenueAnalyticsDto.prototype, "dailyRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average order value', example: 150000 }),
    __metadata("design:type", Number)
], RevenueAnalyticsDto.prototype, "averageOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Revenue growth percentage', example: 15.5 }),
    __metadata("design:type", Number)
], RevenueAnalyticsDto.prototype, "revenueGrowth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top performing deals', type: 'array' }),
    __metadata("design:type", Array)
], RevenueAnalyticsDto.prototype, "topPerformingDeals", void 0);
class CustomerAnalyticsDto {
    totalCustomers;
    activeCustomers;
    newCustomers;
    customerGrowth;
    averageSpendingPerCustomer;
    customerRetentionRate;
    topCustomers;
    customerSegments;
}
exports.CustomerAnalyticsDto = CustomerAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total customers', example: 1000 }),
    __metadata("design:type", Number)
], CustomerAnalyticsDto.prototype, "totalCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active customers', example: 750 }),
    __metadata("design:type", Number)
], CustomerAnalyticsDto.prototype, "activeCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New customers', example: 50 }),
    __metadata("design:type", Number)
], CustomerAnalyticsDto.prototype, "newCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer growth percentage', example: 12.5 }),
    __metadata("design:type", Number)
], CustomerAnalyticsDto.prototype, "customerGrowth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average spending per customer',
        example: 250000,
    }),
    __metadata("design:type", Number)
], CustomerAnalyticsDto.prototype, "averageSpendingPerCustomer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer retention rate', example: 85.5 }),
    __metadata("design:type", Number)
], CustomerAnalyticsDto.prototype, "customerRetentionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top customers', type: 'array' }),
    __metadata("design:type", Array)
], CustomerAnalyticsDto.prototype, "topCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer segments' }),
    __metadata("design:type", Object)
], CustomerAnalyticsDto.prototype, "customerSegments", void 0);
class MerchantAnalyticsDto {
    totalMerchants;
    activeMerchants;
    topPerformingMerchants;
    merchantGrowth;
    averageRevenuePerMerchant;
    merchantPerformance;
}
exports.MerchantAnalyticsDto = MerchantAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total merchants', example: 100 }),
    __metadata("design:type", Number)
], MerchantAnalyticsDto.prototype, "totalMerchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active merchants', example: 85 }),
    __metadata("design:type", Number)
], MerchantAnalyticsDto.prototype, "activeMerchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top performing merchants', type: 'array' }),
    __metadata("design:type", Array)
], MerchantAnalyticsDto.prototype, "topPerformingMerchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant growth percentage', example: 8.5 }),
    __metadata("design:type", Number)
], MerchantAnalyticsDto.prototype, "merchantGrowth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average revenue per merchant', example: 50000 }),
    __metadata("design:type", Number)
], MerchantAnalyticsDto.prototype, "averageRevenuePerMerchant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant performance metrics', type: 'array' }),
    __metadata("design:type", Array)
], MerchantAnalyticsDto.prototype, "merchantPerformance", void 0);
class DealAnalyticsDto {
    totalDeals;
    activeDeals;
    expiredDeals;
    dealPerformance;
    categoryPerformance;
    dealTrends;
}
exports.DealAnalyticsDto = DealAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total deals', example: 500 }),
    __metadata("design:type", Number)
], DealAnalyticsDto.prototype, "totalDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active deals', example: 400 }),
    __metadata("design:type", Number)
], DealAnalyticsDto.prototype, "activeDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expired deals', example: 100 }),
    __metadata("design:type", Number)
], DealAnalyticsDto.prototype, "expiredDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal performance metrics', type: 'array' }),
    __metadata("design:type", Array)
], DealAnalyticsDto.prototype, "dealPerformance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category performance', type: 'array' }),
    __metadata("design:type", Array)
], DealAnalyticsDto.prototype, "categoryPerformance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal trends', type: 'array' }),
    __metadata("design:type", Array)
], DealAnalyticsDto.prototype, "dealTrends", void 0);
class OrderAnalyticsDto {
    totalOrders;
    completedOrders;
    cancelledOrders;
    refundedOrders;
    orderTrends;
    orderStatusDistribution;
    averageOrderProcessingTime;
    orderCompletionRate;
}
exports.OrderAnalyticsDto = OrderAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders', example: 2000 }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Completed orders', example: 1800 }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "completedOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cancelled orders', example: 150 }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "cancelledOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refunded orders', example: 50 }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "refundedOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order trends', type: 'array' }),
    __metadata("design:type", Array)
], OrderAnalyticsDto.prototype, "orderTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order status distribution' }),
    __metadata("design:type", Object)
], OrderAnalyticsDto.prototype, "orderStatusDistribution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average order processing time in hours',
        example: 2.5,
    }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "averageOrderProcessingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order completion rate percentage',
        example: 90.0,
    }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "orderCompletionRate", void 0);
class DashboardAnalyticsDto {
    overview;
    revenue;
    customers;
    merchants;
    deals;
    orders;
    lastUpdated;
}
exports.DashboardAnalyticsDto = DashboardAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Overview metrics' }),
    __metadata("design:type", Object)
], DashboardAnalyticsDto.prototype, "overview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Revenue analytics', type: RevenueAnalyticsDto }),
    __metadata("design:type", RevenueAnalyticsDto)
], DashboardAnalyticsDto.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer analytics',
        type: CustomerAnalyticsDto,
    }),
    __metadata("design:type", CustomerAnalyticsDto)
], DashboardAnalyticsDto.prototype, "customers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Merchant analytics',
        type: MerchantAnalyticsDto,
    }),
    __metadata("design:type", MerchantAnalyticsDto)
], DashboardAnalyticsDto.prototype, "merchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal analytics', type: DealAnalyticsDto }),
    __metadata("design:type", DealAnalyticsDto)
], DashboardAnalyticsDto.prototype, "deals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order analytics', type: OrderAnalyticsDto }),
    __metadata("design:type", OrderAnalyticsDto)
], DashboardAnalyticsDto.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last updated timestamp',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], DashboardAnalyticsDto.prototype, "lastUpdated", void 0);
class AnalyticsQueryDto {
    startDate;
    endDate;
    userRole;
    merchantId;
    categoryId;
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for analytics',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for analytics',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User role filter', enum: client_1.UserRole }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "userRole", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID filter' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category ID filter' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "categoryId", void 0);
//# sourceMappingURL=analytics.dto.js.map