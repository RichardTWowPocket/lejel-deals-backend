import { DealStatus } from '@prisma/client';
export declare class DealMerchantDto {
    id: string;
    businessName: string;
    slug: string;
    logoUrl?: string;
    address?: string;
}
export declare class DealCategoryDto {
    id: string;
    name: string;
    slug: string;
}
export declare class DealResponseDto {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    shortDescription?: string | null;
    dealPrice: number;
    discountPrice: number;
    discountedPrice: number;
    originalPrice: number;
    discountPercentage: number;
    images: string[];
    thumbnailUrl: string;
    validFrom: Date;
    validUntil: Date;
    redemptionDeadline: Date;
    status: DealStatus;
    type: string;
    featured: boolean;
    maxQuantity?: number | null;
    soldQuantity: number;
    quantity: number;
    quantityAvailable: number;
    terms?: string | null;
    highlights?: string[];
    merchantId: string;
    merchant?: DealMerchantDto;
    categoryId?: string | null;
    category?: DealCategoryDto;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        orders: number;
    };
}
export declare class DealListResponseDto {
    deals: DealResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
