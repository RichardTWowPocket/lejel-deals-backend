import { IsString, IsOptional, IsEnum, IsObject, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RedemptionStatus } from '@prisma/client';

export class CreateRedemptionDto {
  @ApiProperty({ description: 'QR code token to redeem', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  qrToken: string;

  @ApiProperty({ description: 'Staff ID performing the redemption', example: 'staff-123' })
  @IsString()
  staffId: string;

  @ApiPropertyOptional({ description: 'Redemption notes', example: 'Redeemed at counter' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Redemption location', example: 'Main Counter' })
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateRedemptionDto {
  @ApiPropertyOptional({ description: 'Redemption status', enum: RedemptionStatus })
  @IsOptional()
  @IsEnum(RedemptionStatus)
  status?: RedemptionStatus;

  @ApiPropertyOptional({ description: 'Redemption notes', example: 'Updated notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Redemption location', example: 'Main Counter' })
  @IsOptional()
  @IsString()
  location?: string;
}

export class RedemptionResponseDto {
  @ApiProperty({ description: 'Redemption ID' })
  id: string;

  @ApiProperty({ description: 'Coupon ID' })
  couponId: string;

  @ApiProperty({ description: 'Staff ID' })
  staffId: string;

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

  @ApiProperty({ description: 'Staff information' })
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
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

  @ApiProperty({ description: 'Redemptions by staff member' })
  redemptionsByStaff: Array<{
    staffId: string;
    staffName: string;
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

  @ApiProperty({ description: 'Top performing staff members' })
  topPerformingStaff: Array<{
    staffId: string;
    staffName: string;
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
      staffId: string;
      staffName: string;
      redemptionCount: number;
    };
  };
}

export class RedemptionValidationDto {
  @ApiProperty({ description: 'Whether the redemption is valid' })
  isValid: boolean;

  @ApiPropertyOptional({ description: 'Error message if invalid' })
  error?: string;

  @ApiProperty({ description: 'Whether the staff can redeem this coupon' })
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

  @ApiPropertyOptional({ description: 'Staff information' })
  staff?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };

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

  @ApiPropertyOptional({ description: 'Filter by staff ID' })
  staffId?: string;

  @ApiPropertyOptional({ description: 'Filter by redemption status', enum: RedemptionStatus })
  status?: RedemptionStatus;

  @ApiPropertyOptional({ description: 'Filter by start date', example: '2024-01-01' })
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by end date', example: '2024-12-31' })
  endDate?: Date;
}



