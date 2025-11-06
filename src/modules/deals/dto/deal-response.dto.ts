import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DealStatus } from '@prisma/client';

export class DealMerchantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  province?: string;

  @ApiPropertyOptional()
  phone?: string;
}

export class DealCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  color?: string;
}

export class DealResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional()
  shortDescription?: string | null;

  @ApiProperty({ description: 'Price customer pays to buy the coupon (IDR)' })
  dealPrice: number;

  @ApiProperty({ description: 'Coupon face value (IDR)' })
  discountPrice: number;

  @ApiProperty({
    description: 'For frontend compatibility - same as discountPrice',
  })
  discountedPrice: number;

  @ApiProperty({
    description: 'For frontend compatibility - same as discountPrice',
  })
  originalPrice: number;

  @ApiProperty({ description: 'Real calculated percentage discount' })
  discountPercentage: number;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  thumbnailUrl: string;

  @ApiProperty()
  validFrom: Date;

  @ApiProperty()
  validUntil: Date;

  @ApiProperty()
  redemptionDeadline: Date;

  @ApiProperty({ enum: DealStatus })
  status: DealStatus;

  @ApiProperty()
  type: string;

  @ApiProperty()
  featured: boolean;

  @ApiPropertyOptional()
  maxQuantity?: number | null;

  @ApiProperty()
  soldQuantity: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({
    description: 'Available quantity (maxQuantity - soldQuantity)',
  })
  quantityAvailable: number;

  @ApiPropertyOptional()
  terms?: string | null;

  @ApiPropertyOptional({ type: [String] })
  highlights?: string[];

  @ApiProperty()
  merchantId: string;

  @ApiPropertyOptional({ type: DealMerchantDto })
  merchant?: DealMerchantDto;

  @ApiPropertyOptional()
  categoryId?: string | null;

  @ApiPropertyOptional({ type: DealCategoryDto })
  category?: DealCategoryDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Number of orders for this deal' })
  _count?: {
    orders: number;
  };
}

export class DealListResponseDto {
  @ApiProperty({ type: [DealResponseDto] })
  deals: DealResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 12,
      total: 100,
      totalPages: 9,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
