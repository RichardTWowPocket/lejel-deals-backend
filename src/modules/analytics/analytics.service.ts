import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async getDashboardAnalytics(userRole: UserRole, userId?: string): Promise<DashboardAnalytics> {
    try {
      const [
        overview,
        revenue,
        customers,
        merchants,
        deals,
        orders,
      ] = await Promise.all([
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
    } catch (error) {
      this.logger.error('Failed to get dashboard analytics:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(userRole: UserRole, userId?: string): Promise<RevenueAnalytics> {
    try {
      const whereClause = this.buildWhereClause(userRole, userId);

      // Get total revenue
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

      // Get monthly revenue for last 12 months
      const monthlyRevenue = await this.getMonthlyRevenue(whereClause);

      // Get daily revenue for last 30 days
      const dailyRevenue = await this.getDailyRevenue(whereClause);

      // Get top performing deals
      const topPerformingDeals = await this.getTopPerformingDeals(whereClause);

      // Calculate growth (comparing last 30 days with previous 30 days)
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
    } catch (error) {
      this.logger.error('Failed to get revenue analytics:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(userRole: UserRole, userId?: string): Promise<CustomerAnalytics> {
    try {
      const whereClause = this.buildWhereClause(userRole, userId);

      // Get total customers
      const totalCustomers = await this.prisma.customer.count();

      // Get active customers (customers with orders in last 30 days)
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

      // Get new customers (customers created in last 30 days)
      const newCustomers = await this.prisma.customer.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      // Get customer growth
      const customerGrowth = await this.calculateCustomerGrowth();

      // Get top customers
      const topCustomers = await this.getTopCustomers(whereClause);

      // Calculate average spending per customer
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

      // Calculate customer retention rate
      const customerRetentionRate = await this.calculateCustomerRetentionRate();

      // Get customer segments
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
    } catch (error) {
      this.logger.error('Failed to get customer analytics:', error);
      throw error;
    }
  }

  async getMerchantAnalytics(userRole: UserRole, userId?: string): Promise<MerchantAnalytics> {
    try {
      const whereClause = this.buildWhereClause(userRole, userId);

      // Get total merchants
      const totalMerchants = await this.prisma.merchant.count();

      // Get active merchants (merchants with active deals)
      const activeMerchants = await this.prisma.merchant.count({
        where: {
          deals: {
            some: {
              status: 'ACTIVE',
            },
          },
        },
      });

      // Get top performing merchants
      const topPerformingMerchants = await this.getTopPerformingMerchants(whereClause);

      // Calculate merchant growth
      const merchantGrowth = await this.calculateMerchantGrowth();

      // Calculate average revenue per merchant
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

      // Get merchant performance metrics
      const merchantPerformance = await this.getMerchantPerformanceMetrics(whereClause);

      return {
        totalMerchants,
        activeMerchants,
        topPerformingMerchants,
        merchantGrowth,
        averageRevenuePerMerchant,
        merchantPerformance,
      };
    } catch (error) {
      this.logger.error('Failed to get merchant analytics:', error);
      throw error;
    }
  }

  async getDealAnalytics(userRole: UserRole, userId?: string): Promise<DealAnalytics> {
    try {
      const whereClause = this.buildWhereClause(userRole, userId);

      // Get total deals
      const totalDeals = await this.prisma.deal.count();

      // Get active deals
      const activeDeals = await this.prisma.deal.count({
        where: {
          status: 'ACTIVE',
        },
      });

      // Get expired deals
      const expiredDeals = await this.prisma.deal.count({
        where: {
          status: 'EXPIRED',
        },
      });

      // Get deal performance
      const dealPerformance = await this.getDealPerformanceMetrics(whereClause);

      // Get category performance
      const categoryPerformance = await this.getCategoryPerformanceMetrics(whereClause);

      // Get deal trends
      const dealTrends = await this.getDealTrends();

      return {
        totalDeals,
        activeDeals,
        expiredDeals,
        dealPerformance,
        categoryPerformance,
        dealTrends,
      };
    } catch (error) {
      this.logger.error('Failed to get deal analytics:', error);
      throw error;
    }
  }

  async getOrderAnalytics(userRole: UserRole, userId?: string): Promise<OrderAnalytics> {
    try {
      const whereClause = this.buildWhereClause(userRole, userId);

      // Get order counts by status
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

      // Get order trends
      const orderTrends = await this.getOrderTrends(whereClause);

      // Calculate average order processing time
      const averageOrderProcessingTime = await this.calculateAverageOrderProcessingTime(whereClause);

      // Calculate order completion rate
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
    } catch (error) {
      this.logger.error('Failed to get order analytics:', error);
      throw error;
    }
  }

  private async getOverviewMetrics(userRole: UserRole, userId?: string) {
    const whereClause = this.buildWhereClause(userRole, userId);

    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalMerchants,
      totalDeals,
      activeCoupons,
    ] = await Promise.all([
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

  private buildWhereClause(userRole: UserRole, userId?: string) {
    const whereClause: any = {};

    if (userRole === UserRole.MERCHANT && userId) {
      whereClause.deal = {
        merchantId: userId,
      };
    } else if (userRole === UserRole.CUSTOMER && userId) {
      whereClause.customerId = userId;
    }

    return whereClause;
  }

  private async getMonthlyRevenue(whereClause: any) {
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

    // Group by month and aggregate
    const monthlyRevenue: { [key: string]: { revenue: number; orders: number } } = {};

    monthlyData.forEach(data => {
      const month = data.createdAt.toISOString().substring(0, 7); // YYYY-MM
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

  private async getDailyRevenue(whereClause: any) {
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

    // Group by date and aggregate
    const dailyRevenue: { [key: string]: { revenue: number; orders: number } } = {};

    dailyData.forEach(data => {
      const date = data.createdAt.toISOString().substring(0, 10); // YYYY-MM-DD
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

  private async getTopPerformingDeals(whereClause: any) {
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

  private async calculateRevenueGrowth(whereClause: any) {
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

  private async calculateCustomerGrowth() {
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

  private async getTopCustomers(whereClause: any) {
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

  private async calculateCustomerRetentionRate() {
    // This is a simplified calculation - in production, you'd want more sophisticated retention metrics
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

  private async getCustomerSegments() {
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

  private async getTopPerformingMerchants(whereClause: any) {
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

    const merchantStats: { [key: string]: { revenue: number; orders: number; deals: number } } = {};

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

  private async calculateMerchantGrowth() {
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

  private async getMerchantPerformanceMetrics(whereClause: any) {
    // This would include more sophisticated metrics like conversion rates
    // For now, returning basic performance data
    return [];
  }

  private async getDealPerformanceMetrics(whereClause: any) {
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
          couponValue: Number(deal?.discountPrice || 0), // Face value of coupon
          orders: perf._count.id,
          revenue: Number(perf._sum.totalAmount || 0),
          conversionRate: 0, // Would need view data to calculate
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);
  }

  private async getCategoryPerformanceMetrics(whereClause: any) {
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

    const categoryStats: { [key: string]: { deals: number; revenue: number; orders: number; name: string } } = {};

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

  private async getDealTrends() {
    // This would analyze deal creation and expiration trends over time
    // For now, returning basic trend data
    return [];
  }

  private async getOrderTrends(whereClause: any) {
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

    const dailyTrends: { [key: string]: { orders: number; revenue: number; averageOrderValue: number } } = {};

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

  private async calculateAverageOrderProcessingTime(whereClause: any) {
    // This would calculate the time from order creation to completion
    // For now, returning a placeholder value
    return 0;
  }
}



