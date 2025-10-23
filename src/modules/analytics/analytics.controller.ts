import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  DashboardAnalyticsDto,
  RevenueAnalyticsDto,
  CustomerAnalyticsDto,
  MerchantAnalyticsDto,
  DealAnalyticsDto,
  OrderAnalyticsDto,
  AnalyticsQueryDto,
} from './dto/analytics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comprehensive dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Dashboard analytics retrieved successfully', type: DashboardAnalyticsDto })
  async getDashboardAnalytics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<DashboardAnalyticsDto> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    return this.analyticsService.getDashboardAnalytics(userRole, userId);
  }

  @Get('revenue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiResponse({ status: 200, description: 'Revenue analytics retrieved successfully', type: RevenueAnalyticsDto })
  async getRevenueAnalytics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<RevenueAnalyticsDto> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    return this.analyticsService.getRevenueAnalytics(userRole, userId);
  }

  @Get('customers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customer analytics' })
  @ApiResponse({ status: 200, description: 'Customer analytics retrieved successfully', type: CustomerAnalyticsDto })
  async getCustomerAnalytics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<CustomerAnalyticsDto> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    return this.analyticsService.getCustomerAnalytics(userRole, userId);
  }

  @Get('merchants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get merchant analytics' })
  @ApiResponse({ status: 200, description: 'Merchant analytics retrieved successfully', type: MerchantAnalyticsDto })
  async getMerchantAnalytics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<MerchantAnalyticsDto> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    return this.analyticsService.getMerchantAnalytics(userRole, userId);
  }

  @Get('deals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get deal analytics' })
  @ApiResponse({ status: 200, description: 'Deal analytics retrieved successfully', type: DealAnalyticsDto })
  async getDealAnalytics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<DealAnalyticsDto> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    return this.analyticsService.getDealAnalytics(userRole, userId);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order analytics' })
  @ApiResponse({ status: 200, description: 'Order analytics retrieved successfully', type: OrderAnalyticsDto })
  async getOrderAnalytics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<OrderAnalyticsDto> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    return this.analyticsService.getOrderAnalytics(userRole, userId);
  }

  @Get('overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get overview metrics' })
  @ApiResponse({ status: 200, description: 'Overview metrics retrieved successfully' })
  async getOverviewMetrics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    const dashboard = await this.analyticsService.getDashboardAnalytics(userRole, userId);
    return dashboard.overview;
  }

  @Get('trends')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business trends' })
  @ApiResponse({ status: 200, description: 'Business trends retrieved successfully' })
  async getBusinessTrends(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
    const userRole = req.user.role;
    const userId = req.user.sub;
    
    const [revenue, orders] = await Promise.all([
      this.analyticsService.getRevenueAnalytics(userRole, userId),
      this.analyticsService.getOrderAnalytics(userRole, userId),
    ]);

    return {
      revenueTrends: revenue.dailyRevenue.slice(-30), // Last 30 days
      orderTrends: orders.orderTrends.slice(-30), // Last 30 days
      revenueGrowth: revenue.revenueGrowth,
      orderGrowth: 0, // Would need to calculate
    };
  }

  @Get('performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  async getPerformanceMetrics(
    @Request() req: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
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
        averageDiscount: 0, // Would need to calculate
        conversionRate: 0, // Would need to calculate
      },
    };
  }
}



