import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryHierarchyResponseDto {
  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: 'parent-category-123',
  })
  parentId?: string;

  @ApiProperty({ description: 'Category level in hierarchy', example: 1 })
  level: number;

  @ApiProperty({
    description: 'Category path in hierarchy',
    example: 'food/beverage',
  })
  path: string;

  @ApiPropertyOptional({ description: 'Parent category name', example: 'Food' })
  parentName?: string;
}

export class CategoryResponseDto {
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

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/category-image.jpg',
  })
  image?: string;

  @ApiPropertyOptional({
    description: 'Category color for UI theming',
    example: '#FF6B6B',
  })
  color?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: 'parent-category-123',
  })
  parentId?: string;

  @ApiProperty({ description: 'Category level in hierarchy', example: 1 })
  level: number;

  @ApiPropertyOptional({
    description: 'Category path in hierarchy',
    example: 'food/beverage',
  })
  path?: string;

  @ApiPropertyOptional({
    description: 'Category sort order within level',
    example: 1,
  })
  sortOrder?: number;

  @ApiProperty({
    description: 'Category tags',
    example: ['food', 'restaurant', 'delivery'],
  })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Category metadata',
    example: { featured: true, priority: 1 },
  })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Is category active', example: true })
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

  // Hierarchy information
  @ApiPropertyOptional({
    description: 'Category hierarchy information',
    type: CategoryHierarchyResponseDto,
  })
  hierarchy?: CategoryHierarchyResponseDto;

  // Statistics
  @ApiPropertyOptional({ description: 'Total deals count', example: 25 })
  totalDeals?: number;

  @ApiPropertyOptional({ description: 'Active deals count', example: 15 })
  activeDeals?: number;

  @ApiPropertyOptional({ description: 'Total merchants count', example: 8 })
  totalMerchants?: number;

  @ApiPropertyOptional({ description: 'Child categories count', example: 3 })
  childCategoriesCount?: number;

  // Child categories
  @ApiPropertyOptional({
    description: 'Child categories',
    type: [CategoryResponseDto],
  })
  children?: CategoryResponseDto[];
}
