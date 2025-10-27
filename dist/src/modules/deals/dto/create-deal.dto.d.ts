import { DealStatus } from '@prisma/client';
export declare class CreateDealDto {
    title: string;
    description?: string;
    dealPrice: number;
    discountPrice: number;
    validFrom: string;
    validUntil: string;
    status?: DealStatus;
    maxQuantity?: number;
    images?: string[];
    terms?: string;
    merchantId: string;
    categoryId?: string;
}
export declare class UpdateDealDto {
    title?: string;
    description?: string;
    dealPrice?: number;
    discountPrice?: number;
    validFrom?: string;
    validUntil?: string;
    status?: DealStatus;
    maxQuantity?: number;
    images?: string[];
    terms?: string;
    categoryId?: string;
}
export declare class UpdateDealStatusDto {
    status: DealStatus;
}
export declare class DealFiltersDto {
    page?: number;
    limit?: number;
    status?: DealStatus;
    merchantId?: string;
    categoryId?: string;
    search?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    city?: string;
    priceMin?: number;
    priceMax?: number;
}
