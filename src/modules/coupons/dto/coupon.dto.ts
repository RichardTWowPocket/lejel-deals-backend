import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponStatus } from '@prisma/client';

export class CouponResponseDto {
  @ApiProperty({ description: 'Coupon ID', example: 'coupon-123' })
  id: string;

  @ApiProperty({ description: 'Order ID', example: 'order-123' })
  orderId: string;

  @ApiProperty({ description: 'Deal ID', example: 'deal-123' })
  dealId: string;

  @ApiProperty({ description: 'QR Code string', example: 'qr_code_string' })
  qrCode: string;

  @ApiProperty({
    description: 'Coupon status',
    enum: CouponStatus,
    example: CouponStatus.ACTIVE,
  })
  status: CouponStatus;

  @ApiPropertyOptional({
    description: 'Used date',
    example: '2024-01-01T12:00:00.000Z',
  })
  usedAt?: Date;

  @ApiProperty({
    description: 'Expiration date',
    example: '2024-02-01T12:00:00.000Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Order details' })
  order?: {
    orderNumber: string;
    customer: {
      firstName?: string;
      lastName?: string;
      email: string;
    };
  };

  @ApiPropertyOptional({ description: 'Deal details' })
  deal?: {
    title: string;
    description?: string;
    merchant: {
      name: string;
    };
  };
}

export class CouponValidationDto {
  @ApiProperty({
    description: 'QR Code to validate',
    example: 'qr_code_string',
  })
  @IsString()
  qrCode: string;
}

export class CouponValidationResponseDto {
  @ApiProperty({ description: 'Whether coupon is valid', example: true })
  isValid: boolean;

  @ApiPropertyOptional({ description: 'Coupon details if valid' })
  coupon?: CouponResponseDto;

  @ApiPropertyOptional({
    description: 'Error message if invalid',
    example: 'Coupon has expired',
  })
  error?: string;
}

export class RedeemCouponDto {
  @ApiProperty({ description: 'QR Code to redeem', example: 'qr_code_string' })
  @IsString()
  qrCode: string;

  @ApiPropertyOptional({
    description: 'Staff ID who redeemed the coupon',
    example: 'staff-123',
  })
  @IsOptional()
  @IsString()
  staffId?: string;

  @ApiPropertyOptional({
    description: 'Redemption notes',
    example: 'Redeemed at counter',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelCouponDto {
  @ApiPropertyOptional({
    description: 'Cancellation reason',
    example: 'Customer requested cancellation',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CouponStatsDto {
  @ApiProperty({ description: 'Total coupons', example: 1000 })
  totalCoupons: number;

  @ApiProperty({ description: 'Active coupons', example: 750 })
  activeCoupons: number;

  @ApiProperty({ description: 'Used coupons', example: 200 })
  usedCoupons: number;

  @ApiProperty({ description: 'Expired coupons', example: 30 })
  expiredCoupons: number;

  @ApiProperty({ description: 'Cancelled coupons', example: 20 })
  cancelledCoupons: number;

  @ApiProperty({ description: 'Total redemptions', example: 200 })
  totalRedemptions: number;

  @ApiProperty({ description: 'Redemption rate percentage', example: 20.0 })
  redemptionRate: number;
}

export class GenerateQRCodeDto {
  @ApiProperty({ description: 'Coupon ID', example: 'coupon-123' })
  @IsString()
  couponId: string;
}
