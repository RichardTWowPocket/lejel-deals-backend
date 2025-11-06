import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer ID', example: 'customer-123' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Deal ID', example: 'deal-123' })
  @IsString()
  dealId: string;

  @ApiProperty({
    description: 'Quantity of deals to order',
    example: 2,
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Payment reference from payment gateway',
    example: 'midtrans_ref_123',
  })
  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PAID,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Payment reference from payment gateway',
    example: 'midtrans_ref_123',
  })
  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    example: OrderStatus.PAID,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Payment reference if status is PAID',
    example: 'midtrans_ref_123',
  })
  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID', example: 'order-123' })
  id: string;

  @ApiProperty({ description: 'Unique order number', example: 'ORD-2024-001' })
  orderNumber: string;

  @ApiProperty({ description: 'Customer ID', example: 'customer-123' })
  customerId: string;

  @ApiProperty({ description: 'Deal ID', example: 'deal-123' })
  dealId: string;

  @ApiProperty({ description: 'Quantity ordered', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Total amount in IDR', example: 150000 })
  totalAmount: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Payment method used',
    example: 'credit_card',
  })
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Payment reference from gateway',
    example: 'midtrans_ref_123',
  })
  paymentReference?: string;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Order last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  // Relations
  @ApiPropertyOptional({ description: 'Customer information' })
  customer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
  };

  @ApiPropertyOptional({ description: 'Deal information' })
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

  @ApiPropertyOptional({ description: 'Generated coupons for this order' })
  coupons?: {
    id: string;
    qrCode: string;
    status: string;
    expiresAt: Date;
  }[];
}

export class OrderStatsDto {
  @ApiProperty({ description: 'Total orders count', example: 150 })
  totalOrders: number;

  @ApiProperty({ description: 'Pending orders count', example: 25 })
  pendingOrders: number;

  @ApiProperty({ description: 'Paid orders count', example: 100 })
  paidOrders: number;

  @ApiProperty({ description: 'Cancelled orders count', example: 15 })
  cancelledOrders: number;

  @ApiProperty({ description: 'Refunded orders count', example: 10 })
  refundedOrders: number;

  @ApiProperty({ description: 'Total revenue in IDR', example: 5000000 })
  totalRevenue: number;

  @ApiProperty({ description: 'Average order value in IDR', example: 33333 })
  averageOrderValue: number;

  @ApiProperty({ description: 'Orders by status distribution' })
  statusDistribution: {
    [key in OrderStatus]: number;
  };
}

export class OrderAnalyticsDto {
  @ApiProperty({
    description: 'Orders count by period',
    example: { '2024-01': 25, '2024-02': 30 },
  })
  ordersByPeriod: Record<string, number>;

  @ApiProperty({
    description: 'Revenue by period',
    example: { '2024-01': 1000000, '2024-02': 1200000 },
  })
  revenueByPeriod: Record<string, number>;

  @ApiProperty({ description: 'Top customers by order count' })
  topCustomers: {
    customerId: string;
    customerName: string;
    orderCount: number;
    totalSpent: number;
  }[];

  @ApiProperty({ description: 'Top deals by order count' })
  topDeals: {
    dealId: string;
    dealTitle: string;
    orderCount: number;
    totalRevenue: number;
  }[];

  @ApiProperty({
    description: 'Order completion rate percentage',
    example: 85.5,
  })
  completionRate: number;

  @ApiProperty({
    description: 'Average time to payment in hours',
    example: 2.5,
  })
  averageTimeToPayment: number;
}
