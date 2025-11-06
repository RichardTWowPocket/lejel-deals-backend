import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryTreeNodeDto {
  @ApiProperty({ description: 'Category ID', example: 'category-123' })
  id: string;

  @ApiProperty({ description: 'Category name', example: 'Food & Beverage' })
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Restaurants, cafes, and food delivery',
  })
  description?: string;

  @ApiPropertyOptional({ description: 'Category icon', example: '🍽️' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Category color', example: '#FF6B6B' })
  color?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: 'parent-category-123',
  })
  parentId?: string;

  @ApiProperty({ description: 'Category level in tree', example: 1 })
  level: number;

  @ApiProperty({ description: 'Category path', example: 'food/beverage' })
  path: string;

  @ApiProperty({ description: 'Is category active', example: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Category sort order', example: 1 })
  sortOrder?: number;

  @ApiProperty({ description: 'Total deals count', example: 25 })
  totalDeals: number;

  @ApiProperty({ description: 'Active deals count', example: 15 })
  activeDeals: number;

  @ApiProperty({ description: 'Child categories', type: [CategoryTreeNodeDto] })
  children: CategoryTreeNodeDto[];
}
