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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const analytics_dto_1 = require("./dto/analytics.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboardAnalytics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        return this.analyticsService.getDashboardAnalytics(userRole, userId);
    }
    async getRevenueAnalytics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        return this.analyticsService.getRevenueAnalytics(userRole, userId);
    }
    async getCustomerAnalytics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        return this.analyticsService.getCustomerAnalytics(userRole, userId);
    }
    async getMerchantAnalytics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        return this.analyticsService.getMerchantAnalytics(userRole, userId);
    }
    async getDealAnalytics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        return this.analyticsService.getDealAnalytics(userRole, userId);
    }
    async getOrderAnalytics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        return this.analyticsService.getOrderAnalytics(userRole, userId);
    }
    async getOverviewMetrics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        const dashboard = await this.analyticsService.getDashboardAnalytics(userRole, userId);
        return dashboard.overview;
    }
    async getBusinessTrends(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        const [revenue, orders] = await Promise.all([
            this.analyticsService.getRevenueAnalytics(userRole, userId),
            this.analyticsService.getOrderAnalytics(userRole, userId),
        ]);
        return {
            revenueTrends: revenue.dailyRevenue.slice(-30),
            orderTrends: orders.orderTrends.slice(-30),
            revenueGrowth: revenue.revenueGrowth,
            orderGrowth: 0,
        };
    }
    async getPerformanceMetrics(req, query) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        const [revenue, customers, merchants, deals, orders] = await Promise.all([
            this.analyticsService.getRevenueAnalytics(userRole, userId),
            this.analyticsService.getCustomerAnalytics(userRole, userId),
            this.analyticsService.getMerchantAnalytics(userRole, userId),
            this.analyticsService.getDealAnalytics(userRole, userId),
            this.analyticsService.getOrderAnalytics(userRole, userId),
        ]);
        return {
            keyMetrics: {
                totalRevenue: revenue.totalRevenue,
                averageOrderValue: revenue.averageOrderValue,
                customerRetentionRate: customers.customerRetentionRate,
                orderCompletionRate: orders.orderCompletionRate,
                revenueGrowth: revenue.revenueGrowth,
                customerGrowth: customers.customerGrowth,
                merchantGrowth: merchants.merchantGrowth,
            },
            topPerformers: {
                deals: revenue.topPerformingDeals.slice(0, 5),
                customers: customers.topCustomers.slice(0, 5),
                merchants: merchants.topPerformingMerchants.slice(0, 5),
            },
            performanceInsights: {
                bestPerformingCategory: deals.categoryPerformance[0]?.categoryName || 'N/A',
                averageDiscount: 0,
                conversionRate: 0,
            },
        };
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive dashboard analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard analytics retrieved successfully',
        type: analytics_dto_1.DashboardAnalyticsDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardAnalytics", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Revenue analytics retrieved successfully',
        type: analytics_dto_1.RevenueAnalyticsDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenueAnalytics", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer analytics retrieved successfully',
        type: analytics_dto_1.CustomerAnalyticsDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCustomerAnalytics", null);
__decorate([
    (0, common_1.Get)('merchants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant analytics retrieved successfully',
        type: analytics_dto_1.MerchantAnalyticsDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMerchantAnalytics", null);
__decorate([
    (0, common_1.Get)('deals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get deal analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Deal analytics retrieved successfully',
        type: analytics_dto_1.DealAnalyticsDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDealAnalytics", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get order analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order analytics retrieved successfully',
        type: analytics_dto_1.OrderAnalyticsDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOrderAnalytics", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get overview metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overview metrics retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOverviewMetrics", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get business trends' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Business trends retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBusinessTrends", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get performance metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Performance metrics retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPerformanceMetrics", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map