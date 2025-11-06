import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OperatingHoursResponseDto {
  @ApiProperty({ description: 'Day of the week', example: 'monday' })
  day: string;

  @ApiProperty({ description: 'Opening time', example: '09:00' })
  openTime: string;

  @ApiProperty({ description: 'Closing time', example: '22:00' })
  closeTime: string;

  @ApiProperty({ description: 'Is open on this day', example: true })
  isOpen: boolean;
}

export class MerchantResponseDto {
  @ApiProperty({ description: 'Merchant ID', example: 'merchant-123' })
  id: string;

  @ApiProperty({ description: 'Merchant name', example: 'Demo Restaurant' })
  name: string;

  @ApiPropertyOptional({
    description: 'Merchant description',
    example: 'A sample restaurant for testing',
  })
  description?: string;

  @ApiProperty({ description: 'Merchant email', example: 'demo@merchant.com' })
  email: string;

  @ApiPropertyOptional({
    description: 'Merchant phone number',
    example: '+6281234567890',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Merchant address',
    example: 'Jl. Demo No. 123',
  })
  address?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Jakarta' })
  city?: string;

  @ApiPropertyOptional({ description: 'Province', example: 'DKI Jakarta' })
  province?: string;

  @ApiPropertyOptional({ description: 'Postal code', example: '12345' })
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://demo-restaurant.com',
  })
  website?: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    example: 'https://via.placeholder.com/200x200',
  })
  logo?: string;

  @ApiProperty({
    description: 'Merchant images URLs',
    example: ['https://via.placeholder.com/400x300'],
  })
  images: string[];

  @ApiPropertyOptional({
    description: 'Operating hours',
    type: [OperatingHoursResponseDto],
  })
  operatingHours?: OperatingHoursResponseDto[];

  @ApiProperty({ description: 'Is merchant active', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  // Statistics
  @ApiPropertyOptional({ description: 'Total deals count', example: 15 })
  totalDeals?: number;

  @ApiPropertyOptional({ description: 'Active deals count', example: 8 })
  activeDeals?: number;

  @ApiPropertyOptional({ description: 'Total orders count', example: 1250 })
  totalOrders?: number;
}
