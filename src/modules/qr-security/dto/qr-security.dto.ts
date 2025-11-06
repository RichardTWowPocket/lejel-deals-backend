import { IsString, IsOptional, IsObject, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateQRCodeDto {
  @ApiProperty({
    description: 'Coupon ID to generate QR code for',
    example: 'coupon-123',
  })
  @IsString()
  couponId: string;
}

export class ValidateQRCodeDto {
  @ApiProperty({
    description: 'QR code token to validate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  qrToken: string;

  @ApiPropertyOptional({
    description: 'Staff ID performing the validation',
    example: 'staff-123',
  })
  @IsOptional()
  @IsString()
  staffId?: string;
}

export class RedeemQRCodeDto {
  @ApiProperty({
    description: 'QR code token to redeem',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  qrToken: string;

  @ApiProperty({
    description: 'Staff ID performing the redemption',
    example: 'staff-123',
  })
  @IsString()
  staffId: string;

  @ApiPropertyOptional({
    description: 'Redemption notes',
    example: 'Redeemed at counter',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RevokeQRCodeDto {
  @ApiProperty({ description: 'Coupon ID to revoke', example: 'coupon-123' })
  @IsString()
  couponId: string;

  @ApiProperty({
    description: 'Reason for revocation',
    example: 'Customer requested cancellation',
  })
  @IsString()
  reason: string;
}

export class QRCodeResponseDto {
  @ApiProperty({ description: 'Generated QR code token' })
  qrToken: string;

  @ApiProperty({ description: 'QR code expiration timestamp' })
  expiresAt: Date;

  @ApiProperty({ description: 'QR code issued timestamp' })
  issuedAt: Date;

  @ApiProperty({ description: 'Coupon information' })
  coupon: {
    id: string;
    orderId: string;
    dealId: string;
    status: string;
    expiresAt: Date;
  };

  @ApiProperty({ description: 'Order information' })
  order: {
    id: string;
    orderNumber: string;
    customerId: string;
    totalAmount: number;
  };

  @ApiProperty({ description: 'Deal information' })
  deal: {
    id: string;
    title: string;
    merchantId: string;
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
}

export class QRCodeValidationResponseDto {
  @ApiProperty({ description: 'Whether the QR code is valid' })
  isValid: boolean;

  @ApiPropertyOptional({ description: 'Error message if invalid' })
  error?: string;

  @ApiPropertyOptional({ description: 'QR code payload' })
  payload?: {
    couponId: string;
    orderId: string;
    dealId: string;
    customerId: string;
    merchantId: string;
    expiresAt: Date;
    issuedAt: Date;
    nonce: string;
  };

  @ApiPropertyOptional({ description: 'Coupon information' })
  coupon?: {
    id: string;
    orderId: string;
    dealId: string;
    status: string;
    expiresAt: Date;
    usedAt?: Date;
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
}

export class QRCodeActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  id: string;

  @ApiProperty({ description: 'Activity action', example: 'GENERATED' })
  action: string;

  @ApiPropertyOptional({ description: 'Coupon ID' })
  couponId?: string;

  @ApiPropertyOptional({ description: 'Activity metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Activity timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

export class QRCodeStatsDto {
  @ApiProperty({ description: 'Total QR codes generated' })
  totalGenerated: number;

  @ApiProperty({ description: 'Total QR codes validated' })
  totalValidated: number;

  @ApiProperty({ description: 'Total QR codes redeemed' })
  totalRedeemed: number;

  @ApiProperty({ description: 'Total QR codes expired' })
  totalExpired: number;

  @ApiProperty({ description: 'Total QR codes revoked' })
  totalRevoked: number;

  @ApiProperty({ description: 'Recent activity count (last 24 hours)' })
  recentActivity: number;

  @ApiProperty({ description: 'Success rate percentage' })
  successRate: number;

  @ApiProperty({ description: 'Expiration rate percentage' })
  expirationRate: number;
}

export class QRCodeHistoryDto {
  @ApiProperty({ description: 'QR code activities', type: [QRCodeActivityDto] })
  activities: QRCodeActivityDto[];

  @ApiProperty({ description: 'Total activities count' })
  total: number;
}
