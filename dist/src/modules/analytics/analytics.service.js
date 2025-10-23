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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    prisma;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardAnalytics(userRole, userId) {
        try {
            const [overview, revenue, customers, merchants, deals, orders,] = await Promise.all([
                this.getOverviewMetrics(userRole, userId),
                this.getRevenueAnalytics(userRole, userId),
                this.getCustomerAnalytics(userRole, userId),
                this.getMerchantAnalytics(userRole, userId),
                this.getDealAnalytics(userRole, userId),
                this.getOrderAnalytics(userRole, userId),
            ]);
            return {
                overview,
                revenue,
                customers,
                merchants,
                deals,
                orders,
                lastUpdated: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Failed to get dashboard analytics:', error);
            throw error;
        }
    }
    async getRevenueAnalytics(userRole, userId) {
        try {
            const whereClause = this.buildWhereClause(userRole, userId);
            const totalRevenueResult = await this.prisma.order.aggregate({
                where: {
                    ...whereClause,
                    status: 'PAID',
                },
                _sum: {
                    totalAmount: true,
                },
                _count: {
                    id: true,
                },
            });
            const totalRevenue = Number(totalRevenueResult._sum.totalAmount || 0);
            const totalOrders = totalRevenueResult._count.id;
            const monthlyRevenue = await this.getMonthlyRevenue(whereClause);
            const dailyRevenue = await this.getDailyRevenue(whereClause);
            const topPerformingDeals = await this.getTopPerformingDeals(whereClause);
            const revenueGrowth = await this.calculateRevenueGrowth(whereClause);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            return {
                totalRevenue,
                monthlyRevenue,
                dailyRevenue,
                averageOrderValue,
                revenueGrowth,
                topPerformingDeals,
            };
        }
        catch (error) {
            this.logger.error('Failed to get revenue analytics:', error);
            throw error;
        }
    }
    async getCustomerAnalytics(userRole, userId) {
        try {
            const whereClause = this.buildWhereClause(userRole, userId);
            const totalCustomers = await this.prisma.customer.count();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const activeCustomers = await this.prisma.customer.count({
                where: {
                    orders: {
                        some: {
                            createdAt: {
                                gte: thirtyDaysAgo,
                            },
                        },
                    },
                },
            });
            const newCustomers = await this.prisma.customer.count({
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
            });
            const customerGrowth = await this.calculateCustomerGrowth();
            const topCustomers = await this.getTopCustomers(whereClause);
            const totalRevenue = await this.prisma.order.aggregate({
                where: {
                    ...whereClause,
                    status: 'PAID',
                },
                _sum: {
                    totalAmount: true,
                },
            });
            const averageSpendingPerCustomer = totalCustomers > 0
                ? Number(totalRevenue._sum.totalAmount || 0) / totalCustomers
                : 0;
            const customerRetentionRate = await this.calculateCustomerRetentionRate();
            const customerSegments = await this.getCustomerSegments();
            return {
                totalCustomers,
                activeCustomers,
                newCustomers,
                customerGrowth,
                averageSpendingPerCustomer,
                customerRetentionRate,
                topCustomers,
                customerSegments,
            };
        }
        catch (error) {
            this.logger.error('Failed to get customer analytics:', error);
            throw error;
        }
    }
    async getMerchantAnalytics(userRole, userId) {
        try {
            const whereClause = this.buildWhereClause(userRole, userId);
            const totalMerchants = await this.prisma.merchant.count();
            const activeMerchants = await this.prisma.merchant.count({
                where: {
                    deals: {
                        some: {
                            status: 'ACTIVE',
                        },
                    },
                },
            });
            const topPerformingMerchants = await this.getTopPerformingMerchants(whereClause);
            const merchantGrowth = await this.calculateMerchantGrowth();
            const totalRevenue = await this.prisma.order.aggregate({
                where: {
                    ...whereClause,
                    status: 'PAID',
                },
                _sum: {
                    totalAmount: true,
                },
            });
            const averageRevenuePerMerchant = totalMerchants > 0
                ? Number(totalRevenue._sum.totalAmount || 0) / totalMerchants
                : 0;
            const merchantPerformance = await this.getMerchantPerformanceMetrics(whereClause);
            return {
                totalMerchants,
                activeMerchants,
                topPerformingMerchants,
                merchantGrowth,
                averageRevenuePerMerchant,
                merchantPerformance,
            };
        }
        catch (error) {
            this.logger.error('Failed to get merchant analytics:', error);
            throw error;
        }
    }
    async getDealAnalytics(userRole, userId) {
        try {
            const whereClause = this.buildWhereClause(userRole, userId);
            const totalDeals = await this.prisma.deal.count();
            const activeDeals = await this.prisma.deal.count({
                where: {
                    status: 'ACTIVE',
                },
            });
            const expiredDeals = await this.prisma.deal.count({
                where: {
                    status: 'EXPIRED',
                },
            });
            const dealPerformance = await this.getDealPerformanceMetrics(whereClause);
            const categoryPerformance = await this.getCategoryPerformanceMetrics(whereClause);
            const dealTrends = await this.getDealTrends();
            return {
                totalDeals,
                activeDeals,
                expiredDeals,
                dealPerformance,
                categoryPerformance,
                dealTrends,
            };
        }
        catch (error) {
            this.logger.error('Failed to get deal analytics:', error);
            throw error;
        }
    }
    async getOrderAnalytics(userRole, userId) {
        try {
            const whereClause = this.buildWhereClause(userRole, userId);
            const orderCounts = await this.prisma.order.groupBy({
                by: ['status'],
                where: whereClause,
                _count: {
                    id: true,
                },
            });
            const orderStatusDistribution = {
                pending: 0,
                paid: 0,
                cancelled: 0,
                refunded: 0,
            };
            orderCounts.forEach(count => {
                switch (count.status) {
                    case 'PENDING':
                        orderStatusDistribution.pending = count._count.id;
                        break;
                    case 'PAID':
                        orderStatusDistribution.paid = count._count.id;
                        break;
                    case 'CANCELLED':
                        orderStatusDistribution.cancelled = count._count.id;
                        break;
                    case 'REFUNDED':
                        orderStatusDistribution.refunded = count._count.id;
                        break;
                }
            });
            const totalOrders = orderCounts.reduce((sum, count) => sum + count._count.id, 0);
            const completedOrders = orderStatusDistribution.paid;
            const cancelledOrders = orderStatusDistribution.cancelled;
            const refundedOrders = orderStatusDistribution.refunded;
            const orderTrends = await this.getOrderTrends(whereClause);
            const averageOrderProcessingTime = await this.calculateAverageOrderProcessingTime(whereClause);
            const orderCompletionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
            return {
                totalOrders,
                completedOrders,
                cancelledOrders,
                refundedOrders,
                orderTrends,
                orderStatusDistribution,
                averageOrderProcessingTime,
                orderCompletionRate,
            };
        }
        catch (error) {
            this.logger.error('Failed to get order analytics:', error);
            throw error;
        }
    }
    async getOverviewMetrics(userRole, userId) {
        const whereClause = this.buildWhereClause(userRole, userId);
        const [totalRevenue, totalOrders, totalCustomers, totalMerchants, totalDeals, activeCoupons,] = await Promise.all([
            this.prisma.order.aggregate({
                where: { ...whereClause, status: 'PAID' },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.count({ where: whereClause }),
            this.prisma.customer.count(),
            this.prisma.merchant.count(),
            this.prisma.deal.count(),
            this.prisma.coupon.count({ where: { status: 'ACTIVE' } }),
        ]);
        return {
            totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
            totalOrders,
            totalCustomers,
            totalMerchants,
            totalDeals,
            activeCoupons,
        };
    }
    buildWhereClause(userRole, userId) {
        const whereClause = {};
        if (userRole === client_1.UserRole.MERCHANT && userId) {
            whereClause.deal = {
                merchantId: userId,
            };
        }
        else if (userRole === client_1.UserRole.CUSTOMER && userId) {
            whereClause.customerId = userId;
        }
        return whereClause;
    }
    async getMonthlyRevenue(whereClause) {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const monthlyData = await this.prisma.order.groupBy({
            by: ['createdAt'],
            where: {
                ...whereClause,
                status: 'PAID',
                createdAt: {
                    gte: twelveMonthsAgo,
                },
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });
        const monthlyRevenue = {};
        monthlyData.forEach(data => {
            const month = data.createdAt.toISOString().substring(0, 7);
            if (!monthlyRevenue[month]) {
                monthlyRevenue[month] = { revenue: 0, orders: 0 };
            }
            monthlyRevenue[month].revenue += Number(data._sum.totalAmount || 0);
            monthlyRevenue[month].orders += data._count.id;
        });
        return Object.entries(monthlyRevenue).map(([month, data]) => ({
            month,
            revenue: data.revenue,
            orders: data.orders,
        }));
    }
    async getDailyRevenue(whereClause) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dailyData = await this.prisma.order.groupBy({
            by: ['createdAt'],
            where: {
                ...whereClause,
                status: 'PAID',
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });
        const dailyRevenue = {};
        dailyData.forEach(data => {
            const date = data.createdAt.toISOString().substring(0, 10);
            if (!dailyRevenue[date]) {
                dailyRevenue[date] = { revenue: 0, orders: 0 };
            }
            dailyRevenue[date].revenue += Number(data._sum.totalAmount || 0);
            dailyRevenue[date].orders += data._count.id;
        });
        return Object.entries(dailyRevenue).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
        }));
    }
    async getTopPerformingDeals(whereClause) {
        const dealPerformance = await this.prisma.order.groupBy({
            by: ['dealId'],
            where: {
                ...whereClause,
                status: 'PAID',
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });
        const dealIds = dealPerformance.map(d => d.dealId);
        const deals = await this.prisma.deal.findMany({
            where: {
                id: { in: dealIds },
            },
            include: {
                merchant: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return dealPerformance
            .map(perf => {
            const deal = deals.find(d => d.id === perf.dealId);
            return {
                dealId: perf.dealId,
                dealTitle: deal?.title || 'Unknown Deal',
                revenue: Number(perf._sum.totalAmount || 0),
                orders: perf._count.id,
                merchantName: deal?.merchant.name || 'Unknown Merchant',
            };
        })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }
    async calculateRevenueGrowth(whereClause) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const [recentRevenue, previousRevenue] = await Promise.all([
            this.prisma.order.aggregate({
                where: {
                    ...whereClause,
                    status: 'PAID',
                    createdAt: {
                        gte: thirtyDaysAgo,
                        lt: now,
                    },
                },
                _sum: {
                    totalAmount: true,
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    ...whereClause,
                    status: 'PAID',
                    createdAt: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo,
                    },
                },
                _sum: {
                    totalAmount: true,
                },
            }),
        ]);
        const recent = Number(recentRevenue._sum.totalAmount || 0);
        const previous = Number(previousRevenue._sum.totalAmount || 0);
        return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
    }
    async calculateCustomerGrowth() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const [recentCustomers, previousCustomers] = await Promise.all([
            this.prisma.customer.count({
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo,
                        lt: now,
                    },
                },
            }),
            this.prisma.customer.count({
                where: {
                    createdAt: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo,
                    },
                },
            }),
        ]);
        return previousCustomers > 0 ? ((recentCustomers - previousCustomers) / previousCustomers) * 100 : 0;
    }
    async getTopCustomers(whereClause) {
        const customerPerformance = await this.prisma.order.groupBy({
            by: ['customerId'],
            where: {
                ...whereClause,
                status: 'PAID',
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
            _max: {
                createdAt: true,
            },
        });
        const customerIds = customerPerformance.map(c => c.customerId);
        const customers = await this.prisma.customer.findMany({
            where: {
                id: { in: customerIds },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });
        return customerPerformance
            .map(perf => {
            const customer = customers.find(c => c.id === perf.customerId);
            return {
                customerId: perf.customerId,
                customerName: customer
                    ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown Customer'
                    : 'Unknown Customer',
                totalSpent: Number(perf._sum.totalAmount || 0),
                orders: perf._count.id,
                lastOrderDate: perf._max.createdAt || new Date(),
            };
        })
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10);
    }
    async calculateCustomerRetentionRate() {
        const totalCustomers = await this.prisma.customer.count();
        const customersWithMultipleOrders = await this.prisma.customer.count({
            where: {
                orders: {
                    some: {},
                },
            },
        });
        return totalCustomers > 0 ? (customersWithMultipleOrders / totalCustomers) * 100 : 0;
    }
    async getCustomerSegments() {
        const customerSpending = await this.prisma.order.groupBy({
            by: ['customerId'],
            where: {
                status: 'PAID',
            },
            _sum: {
                totalAmount: true,
            },
        });
        const spendingAmounts = customerSpending.map(c => Number(c._sum.totalAmount || 0));
        const avgSpending = spendingAmounts.reduce((sum, amount) => sum + amount, 0) / spendingAmounts.length;
        const highValue = spendingAmounts.filter(amount => amount > avgSpending * 2).length;
        const mediumValue = spendingAmounts.filter(amount => amount > avgSpending && amount <= avgSpending * 2).length;
        const lowValue = spendingAmounts.filter(amount => amount <= avgSpending).length;
        return {
            highValue,
            mediumValue,
            lowValue,
        };
    }
    async getTopPerformingMerchants(whereClause) {
        const merchantPerformance = await this.prisma.order.groupBy({
            by: ['dealId'],
            where: {
                ...whereClause,
                status: 'PAID',
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });
        const dealIds = merchantPerformance.map(d => d.dealId);
        const deals = await this.prisma.deal.findMany({
            where: {
                id: { in: dealIds },
            },
            include: {
                merchant: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const merchantStats = {};
        merchantPerformance.forEach(perf => {
            const deal = deals.find(d => d.id === perf.dealId);
            if (deal) {
                const merchantId = deal.merchant.id;
                if (!merchantStats[merchantId]) {
                    merchantStats[merchantId] = { revenue: 0, orders: 0, deals: 0 };
                }
                merchantStats[merchantId].revenue += Number(perf._sum.totalAmount || 0);
                merchantStats[merchantId].orders += perf._count.id;
                merchantStats[merchantId].deals += 1;
            }
        });
        return Object.entries(merchantStats)
            .map(([merchantId, stats]) => {
            const merchant = deals.find(d => d.merchant.id === merchantId)?.merchant;
            return {
                merchantId,
                merchantName: merchant?.name || 'Unknown Merchant',
                revenue: stats.revenue,
                orders: stats.orders,
                deals: stats.deals,
            };
        })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }
    async calculateMerchantGrowth() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const [recentMerchants, previousMerchants] = await Promise.all([
            this.prisma.merchant.count({
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo,
                        lt: now,
                    },
                },
            }),
            this.prisma.merchant.count({
                where: {
                    createdAt: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo,
                    },
                },
            }),
        ]);
        return previousMerchants > 0 ? ((recentMerchants - previousMerchants) / previousMerchants) * 100 : 0;
    }
    async getMerchantPerformanceMetrics(whereClause) {
        return [];
    }
    async getDealPerformanceMetrics(whereClause) {
        const dealPerformance = await this.prisma.order.groupBy({
            by: ['dealId'],
            where: {
                ...whereClause,
                status: 'PAID',
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });
        const dealIds = dealPerformance.map(d => d.dealId);
        const deals = await this.prisma.deal.findMany({
            where: {
                id: { in: dealIds },
            },
            include: {
                merchant: {
                    select: {
                        name: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return dealPerformance
            .map(perf => {
            const deal = deals.find(d => d.id === perf.dealId);
            return {
                dealId: perf.dealId,
                dealTitle: deal?.title || 'Unknown Deal',
                merchantName: deal?.merchant.name || 'Unknown Merchant',
                category: deal?.category?.name || 'Uncategorized',
                couponValue: Number(deal?.discountPrice || 0),
                orders: perf._count.id,
                revenue: Number(perf._sum.totalAmount || 0),
                conversionRate: 0,
            };
        })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 20);
    }
    async getCategoryPerformanceMetrics(whereClause) {
        const dealPerformance = await this.prisma.order.groupBy({
            by: ['dealId'],
            where: {
                ...whereClause,
                status: 'PAID',
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });
        const dealIds = dealPerformance.map(d => d.dealId);
        const deals = await this.prisma.deal.findMany({
            where: {
                id: { in: dealIds },
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const categoryStats = {};
        dealPerformance.forEach(perf => {
            const deal = deals.find(d => d.id === perf.dealId);
            if (deal?.category) {
                const categoryId = deal.category.id;
                if (!categoryStats[categoryId]) {
                    categoryStats[categoryId] = { deals: 0, revenue: 0, orders: 0, name: deal.category.name };
                }
                categoryStats[categoryId].revenue += Number(perf._sum.totalAmount || 0);
                categoryStats[categoryId].orders += perf._count.id;
                categoryStats[categoryId].deals += 1;
            }
        });
        return Object.entries(categoryStats)
            .map(([categoryId, stats]) => ({
            categoryId,
            categoryName: stats.name,
            deals: stats.deals,
            revenue: stats.revenue,
            orders: stats.orders,
        }))
            .sort((a, b) => b.revenue - a.revenue);
    }
    async getDealTrends() {
        return [];
    }
    async getOrderTrends(whereClause) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dailyData = await this.prisma.order.groupBy({
            by: ['createdAt'],
            where: {
                ...whereClause,
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });
        const dailyTrends = {};
        dailyData.forEach(data => {
            const date = data.createdAt.toISOString().substring(0, 10);
            if (!dailyTrends[date]) {
                dailyTrends[date] = { orders: 0, revenue: 0, averageOrderValue: 0 };
            }
            dailyTrends[date].orders += data._count.id;
            dailyTrends[date].revenue += Number(data._sum.totalAmount || 0);
        });
        return Object.entries(dailyTrends).map(([period, data]) => ({
            period,
            orders: data.orders,
            revenue: data.revenue,
            averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
        }));
    }
    async calculateAverageOrderProcessingTime(whereClause) {
        return 0;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map