import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerStatsDto {
  @ApiProperty({ description: 'Customer ID', example: 'customer-123' })
  customerId: string;

  @ApiProperty({ description: 'Total orders count', example: 25 })
  totalOrders: number;

  @ApiProperty({ description: 'Total spent amount', example: 2500000 })
  totalSpent: number;

  @ApiProperty({ description: 'Average order value', example: 100000 })
  averageOrderValue: number;

  @ApiPropertyOptional({
    description: 'Last order date',
    example: '2024-01-15T00:00:00.000Z',
  })
  lastOrderDate?: Date;

  @ApiPropertyOptional({
    description: 'First order date',
    example: '2023-06-01T00:00:00.000Z',
  })
  firstOrderDate?: Date;

  @ApiProperty({ description: 'Active deals count', example: 3 })
  activeDeals: number;

  @ApiProperty({ description: 'Used deals count', example: 22 })
  usedDeals: number;

  @ApiProperty({
    description: 'Favorite categories',
    example: ['Food & Beverage', 'Entertainment'],
  })
  favoriteCategories: string[];

  @ApiProperty({ description: 'Customer tier', example: 'Gold' })
  tier: string;

  @ApiProperty({ description: 'Loyalty points', example: 1500 })
  loyaltyPoints: number;

  @ApiProperty({
    description: 'Registration date',
    example: '2023-06-01T00:00:00.000Z',
  })
  registrationDate: Date;

  @ApiProperty({ description: 'Days since last order', example: 5 })
  daysSinceLastOrder: number;

  @ApiProperty({ description: 'Total savings from deals', example: 500000 })
  totalSavings: number;
}
