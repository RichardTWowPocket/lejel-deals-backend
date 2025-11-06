import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationPreferencesResponseDto {
  @ApiProperty({ description: 'Email notifications enabled', example: true })
  email: boolean;

  @ApiProperty({ description: 'SMS notifications enabled', example: true })
  sms: boolean;

  @ApiProperty({ description: 'Push notifications enabled', example: true })
  push: boolean;

  @ApiProperty({
    description: 'WhatsApp notifications enabled',
    example: false,
  })
  whatsapp: boolean;

  @ApiProperty({ description: 'Deal notifications enabled', example: true })
  deals: boolean;

  @ApiProperty({ description: 'Order notifications enabled', example: true })
  orders: boolean;

  @ApiProperty({
    description: 'Marketing notifications enabled',
    example: false,
  })
  marketing: boolean;
}

export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer ID', example: 'customer-123' })
  id: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+6281234567890',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-01-01T00:00:00.000Z',
  })
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'Customer preferences',
    type: NotificationPreferencesResponseDto,
  })
  preferences?: NotificationPreferencesResponseDto;

  @ApiProperty({ description: 'Is customer active', example: true })
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
  @ApiPropertyOptional({ description: 'Total orders count', example: 25 })
  totalOrders?: number;

  @ApiPropertyOptional({ description: 'Total spent amount', example: 2500000 })
  totalSpent?: number;

  @ApiPropertyOptional({
    description: 'Last order date',
    example: '2024-01-15T00:00:00.000Z',
  })
  lastOrderDate?: Date;

  @ApiPropertyOptional({
    description: 'Favorite categories',
    example: ['Food & Beverage', 'Entertainment'],
  })
  favoriteCategories?: string[];

  @ApiPropertyOptional({ description: 'Customer tier', example: 'Gold' })
  tier?: string;

  @ApiPropertyOptional({ description: 'Loyalty points', example: 1500 })
  loyaltyPoints?: number;
}
