import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RevenueAnalyticsDto {
  @ApiProperty({ description: 'Total revenue', example: 5000000 })
  totalRevenue: number;

  @ApiProperty({ description: 'Monthly revenue data', type: 'array' })
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;

  @ApiProperty({ description: 'Daily revenue data', type: 'array' })
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;

  @ApiProperty({ description: 'Average order value', example: 150000 })
  averageOrderValue: number;

  @ApiProperty({ description: 'Revenue growth percentage', example: 15.5 })
  revenueGrowth: number;

  @ApiProperty({ description: 'Top performing deals', type: 'array' })
  topPerformingDeals: Array<{
    dealId: string;
    dealTitle: string;
    revenue: number;
    orders: number;
    merchantName: string;
  }>;
}

export class CustomerAnalyticsDto {
  @ApiProperty({ description: 'Total customers', example: 1000 })
  totalCustomers: number;

  @ApiProperty({ description: 'Active customers', example: 750 })
  activeCustomers: number;

  @ApiProperty({ description: 'New customers', example: 50 })
  newCustomers: number;

  @ApiProperty({ description: 'Customer growth percentage', example: 12.5 })
  customerGrowth: number;

  @ApiProperty({
    description: 'Average spending per customer',
    example: 250000,
  })
  averageSpendingPerCustomer: number;

  @ApiProperty({ description: 'Customer retention rate', example: 85.5 })
  customerRetentionRate: number;

  @ApiProperty({ description: 'Top customers', type: 'array' })
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalSpent: number;
    orders: number;
    lastOrderDate: Date;
  }>;

  @ApiProperty({ description: 'Customer segments' })
  customerSegments: {
    highValue: number;
    mediumValue: number;
    lowValue: number;
  };
}

export class MerchantAnalyticsDto {
  @ApiProperty({ description: 'Total merchants', example: 100 })
  totalMerchants: number;

  @ApiProperty({ description: 'Active merchants', example: 85 })
  activeMerchants: number;

  @ApiProperty({ description: 'Top performing merchants', type: 'array' })
  topPerformingMerchants: Array<{
    merchantId: string;
    merchantName: string;
    revenue: number;
    orders: number;
    deals: number;
    averageRating?: number;
  }>;

  @ApiProperty({ description: 'Merchant growth percentage', example: 8.5 })
  merchantGrowth: number;

  @ApiProperty({ description: 'Average revenue per merchant', example: 50000 })
  averageRevenuePerMerchant: number;

  @ApiProperty({ description: 'Merchant performance metrics', type: 'array' })
  merchantPerformance: Array<{
    merchantId: string;
    merchantName: string;
    revenue: number;
    orders: number;
    conversionRate: number;
  }>;
}

export class DealAnalyticsDto {
  @ApiProperty({ description: 'Total deals', example: 500 })
  totalDeals: number;

  @ApiProperty({ description: 'Active deals', example: 400 })
  activeDeals: number;

  @ApiProperty({ description: 'Expired deals', example: 100 })
  expiredDeals: number;

  @ApiProperty({ description: 'Deal performance metrics', type: 'array' })
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

  @ApiProperty({ description: 'Category performance', type: 'array' })
  categoryPerformance: Array<{
    categoryId: string;
    categoryName: string;
    deals: number;
    revenue: number;
    orders: number;
  }>;

  @ApiProperty({ description: 'Deal trends', type: 'array' })
  dealTrends: Array<{
    period: string;
    dealsCreated: number;
    dealsExpired: number;
    averageDiscount: number;
  }>;
}

export class OrderAnalyticsDto {
  @ApiProperty({ description: 'Total orders', example: 2000 })
  totalOrders: number;

  @ApiProperty({ description: 'Completed orders', example: 1800 })
  completedOrders: number;

  @ApiProperty({ description: 'Cancelled orders', example: 150 })
  cancelledOrders: number;

  @ApiProperty({ description: 'Refunded orders', example: 50 })
  refundedOrders: number;

  @ApiProperty({ description: 'Order trends', type: 'array' })
  orderTrends: Array<{
    period: string;
    orders: number;
    revenue: number;
    averageOrderValue: number;
  }>;

  @ApiProperty({ description: 'Order status distribution' })
  orderStatusDistribution: {
    pending: number;
    paid: number;
    cancelled: number;
    refunded: number;
  };

  @ApiProperty({
    description: 'Average order processing time in hours',
    example: 2.5,
  })
  averageOrderProcessingTime: number;

  @ApiProperty({
    description: 'Order completion rate percentage',
    example: 90.0,
  })
  orderCompletionRate: number;
}

export class DashboardAnalyticsDto {
  @ApiProperty({ description: 'Overview metrics' })
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalMerchants: number;
    totalDeals: number;
    activeCoupons: number;
  };

  @ApiProperty({ description: 'Revenue analytics', type: RevenueAnalyticsDto })
  revenue: RevenueAnalyticsDto;

  @ApiProperty({
    description: 'Customer analytics',
    type: CustomerAnalyticsDto,
  })
  customers: CustomerAnalyticsDto;

  @ApiProperty({
    description: 'Merchant analytics',
    type: MerchantAnalyticsDto,
  })
  merchants: MerchantAnalyticsDto;

  @ApiProperty({ description: 'Deal analytics', type: DealAnalyticsDto })
  deals: DealAnalyticsDto;

  @ApiProperty({ description: 'Order analytics', type: OrderAnalyticsDto })
  orders: OrderAnalyticsDto;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  lastUpdated: Date;
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for analytics',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for analytics',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'User role filter', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  userRole?: UserRole;

  @ApiPropertyOptional({ description: 'Merchant ID filter' })
  @IsOptional()
  merchantId?: string;

  @ApiPropertyOptional({ description: 'Category ID filter' })
  @IsOptional()
  categoryId?: string;
}
