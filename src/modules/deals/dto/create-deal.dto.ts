import { IsString, IsOptional, IsNumber, IsDateString, IsArray, IsEnum, IsBoolean, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DealStatus } from '@prisma/client';

export class CreateDealDto {
  @ApiProperty({ description: 'Deal title', example: 'Pizza Voucher Rp 50.000' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description', example: 'Voucher senilai Rp 50.000 untuk semua menu pizza. Berlaku untuk makan di tempat dan dibawa pulang.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Price customer pays to buy the coupon (IDR)', example: 40000 })
  @IsNumber()
  @Min(1000)
  dealPrice: number;

  @ApiProperty({ description: 'Coupon face value in IDR', example: 50000 })
  @IsNumber()
  @Min(1000)
  discountPrice: number;

  @ApiProperty({ description: 'Valid from date', example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ description: 'Valid until date', example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  validUntil: string;

  @ApiPropertyOptional({ description: 'Deal status', enum: DealStatus, default: DealStatus.DRAFT })
  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @ApiPropertyOptional({ description: 'Maximum quantity available', example: 100 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxQuantity?: number;

  @ApiPropertyOptional({ description: 'Array of image URLs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ description: 'Terms and conditions' })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiProperty({ description: 'Merchant ID (UUID)', example: 'cm123456789' })
  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @ApiPropertyOptional({ description: 'Category ID (UUID)', example: 'cm987654321' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateDealDto {
  @ApiPropertyOptional({ description: 'Deal title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Detailed description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Price customer pays to buy the coupon (IDR)', example: 40000 })
  @IsNumber()
  @IsOptional()
  @Min(1000)
  dealPrice?: number;

  @ApiPropertyOptional({ description: 'Coupon face value in IDR', example: 50000 })
  @IsNumber()
  @IsOptional()
  @Min(1000)
  discountPrice?: number;

  @ApiPropertyOptional({ description: 'Valid from date' })
  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @ApiPropertyOptional({ description: 'Valid until date' })
  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @ApiPropertyOptional({ description: 'Deal status', enum: DealStatus })
  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @ApiPropertyOptional({ description: 'Maximum quantity available' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxQuantity?: number;

  @ApiPropertyOptional({ description: 'Array of image URLs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ description: 'Terms and conditions' })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiPropertyOptional({ description: 'Category ID (UUID)' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateDealStatusDto {
  @ApiProperty({ description: 'New status', enum: DealStatus })
  @IsEnum(DealStatus)
  status: DealStatus;
}

export class DealFiltersDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 12 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by status', enum: DealStatus })
  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsString()
  @IsOptional()
  merchantId?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Search term for title/description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter featured deals only', example: true })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Sort by field', example: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], example: 'desc' })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filter by merchant city', example: 'Jakarta' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Minimum deal price in IDR', example: 10000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional({ description: 'Maximum deal price in IDR', example: 100000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  priceMax?: number;
}

