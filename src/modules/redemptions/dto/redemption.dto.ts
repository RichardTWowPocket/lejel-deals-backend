import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RedemptionStatus } from '@prisma/client';

export class CreateRedemptionDto {
  @ApiProperty({
    description: 'QR code token to redeem',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  qrToken: string;

  @ApiProperty({
    description: 'User ID performing the redemption',
    example: 'user-123',
  })
  @IsString()
  redeemedByUserId: string;

  @ApiPropertyOptional({
    description: 'Redemption notes',
    example: 'Redeemed at counter',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Redemption location',
    example: 'Main Counter',
  })
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateRedemptionDto {
  @ApiPropertyOptional({
    description: 'Redemption status',
    enum: RedemptionStatus,
  })
  @IsOptional()
  @IsEnum(RedemptionStatus)
  status?: RedemptionStatus;

  @ApiPropertyOptional({
    description: 'Redemption notes',
    example: 'Updated notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Redemption location',
    example: 'Main Counter',
  })
  @IsOptional()
  @IsString()
  location?: string;
}

export class RedemptionResponseDto {
  @ApiProperty({ description: 'Redemption ID' })
  id: string;

  @ApiProperty({ description: 'Coupon ID' })
  couponId: string;

  @ApiProperty({ description: 'Redeemed by user ID' })
  redeemedByUserId: string;

  @ApiPropertyOptional({ description: 'Redemption notes' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Redemption location' })
  location?: string;

  @ApiProperty({ description: 'Redemption status', enum: RedemptionStatus })
  status: RedemptionStatus;

  @ApiProperty({ description: 'Redemption timestamp' })
  redeemedAt: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Redemption metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Coupon information' })
  coupon: {
    id: string;
    orderId: string;
    dealId: string;
    status: string;
    expiresAt: Date;
    usedAt?: Date;
  };

  @ApiProperty({ description: 'Order information' })
  order: {
    id: string;
    orderNumber: string;
    customerId: string;
    totalAmount: number;
    status: string;
  };

  @ApiProperty({ description: 'Deal information' })
  deal: {
    id: string;
    title: string;
    description: string;
    merchantId: string;
    discountPrice: number;
  };

  @ApiProperty({ description: 'Customer information' })
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ description: 'Merchant information' })
  merchant: {
    id: string;
    name: string;
    email: string;
  };

  // Staff model removed; see merchant memberships for per-merchant roles
}

export class RedemptionStatsDto {
  @ApiProperty({ description: 'Total redemptions count' })
  totalRedemptions: number;

  @ApiProperty({ description: 'Completed redemptions count' })
  completedRedemptions: number;

  @ApiProperty({ description: 'Pending redemptions count' })
  pendingRedemptions: number;

  @ApiProperty({ description: 'Cancelled redemptions count' })
  cancelledRedemptions: number;

  @ApiProperty({ description: 'Completion rate percentage' })
  completionRate: number;

  @ApiProperty({ description: 'Redemptions by user' })
  redemptionsByStaff: Array<{
    userId: string;
    userEmail: string;
    redemptionCount: number;
  }>;

  @ApiProperty({ description: 'Recent redemptions count (last 24 hours)' })
  recentRedemptions: number;

  @ApiPropertyOptional({ description: 'Average redemption time' })
  averageRedemptionTime?: Date;

  @ApiProperty({ description: 'Status distribution' })
  statusDistribution: {
    completed: number;
    pending: number;
    cancelled: number;
  };
}

export class RedemptionAnalyticsDto {
  @ApiProperty({ description: 'Daily redemption statistics' })
  dailyRedemptions: Array<{
    date: string;
    count: number;
  }>;

  @ApiProperty({ description: 'Hourly redemption statistics' })
  hourlyRedemptions: Array<{
    hour: number;
    count: number;
  }>;

  @ApiProperty({ description: 'Top performing users' })
  topPerformingStaff: Array<{
    userId: string;
    userEmail: string;
    redemptionCount: number;
  }>;

  @ApiProperty({ description: 'Redemption trends over time' })
  redemptionTrends: Array<{
    date: Date;
    status: string;
  }>;

  @ApiProperty({ description: 'Customer redemption statistics' })
  customerRedemptions: Array<{
    customerId: string;
    customerName: string;
    redemptionCount: number;
  }>;

  @ApiProperty({ description: 'Analytics summary' })
  summary: {
    totalRedemptions: number;
    averageDailyRedemptions: number;
    peakHour?: {
      hour: number;
      count: number;
    };
    topStaff?: {
      userId: string;
      userEmail: string;
      redemptionCount: number;
    };
  };
}

export class RedemptionValidationDto {
  @ApiProperty({ description: 'Whether the redemption is valid' })
  isValid: boolean;

  @ApiPropertyOptional({ description: 'Error message if invalid' })
  error?: string;

  @ApiProperty({ description: 'Whether the user can redeem this coupon' })
  canRedeem: boolean;

  @ApiPropertyOptional({ description: 'Coupon information' })
  coupon?: {
    id: string;
    orderId: string;
    dealId: string;
    status: string;
    expiresAt: Date;
  };

  @ApiPropertyOptional({ description: 'Order information' })
  order?: {
    id: string;
    orderNumber: string;
    customerId: string;
    totalAmount: number;
    status: string;
  };

  @ApiPropertyOptional({ description: 'Deal information' })
  deal?: {
    id: string;
    title: string;
    description: string;
    merchantId: string;
    discountPrice: number;
  };

  @ApiPropertyOptional({ description: 'Customer information' })
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiPropertyOptional({ description: 'Merchant information' })
  merchant?: {
    id: string;
    name: string;
    email: string;
  };

  // Staff information removed

  @ApiPropertyOptional({ description: 'Validation timestamp' })
  validationTimestamp?: Date;
}

export class RedemptionFiltersDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  merchantId?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID who redeemed' })
  redeemedByUserId?: string;

  @ApiPropertyOptional({
    description: 'Filter by redemption status',
    enum: RedemptionStatus,
  })
  status?: RedemptionStatus;

  @ApiPropertyOptional({
    description: 'Filter by start date',
    example: '2024-01-01',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter by end date',
    example: '2024-12-31',
  })
  endDate?: Date;
}
