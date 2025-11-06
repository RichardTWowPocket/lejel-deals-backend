import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsNumber,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Food & Beverage' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Restaurants, cafes, and food delivery',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Category icon', example: '🍽️' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/category-image.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Category color for UI theming',
    example: '#FF6B6B',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID for hierarchy',
    example: 'parent-category-123',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({
    description:
      'Category level in hierarchy (auto-calculated if not provided)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  level?: number;

  @ApiPropertyOptional({
    description: 'Category path in hierarchy (auto-generated if not provided)',
    example: 'food/beverage',
  })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({
    description: 'Category sort order within the same level',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Category tags for searchability',
    example: ['food', 'restaurant', 'delivery'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Category metadata for flexible data storage',
    example: { featured: true, priority: 1 },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Is category active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
