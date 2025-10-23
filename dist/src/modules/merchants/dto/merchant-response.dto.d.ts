export declare class OperatingHoursResponseDto {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}
export declare class MerchantResponseDto {
    id: string;
    name: string;
    description?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    website?: string;
    logo?: string;
    images: string[];
    operatingHours?: OperatingHoursResponseDto[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    totalDeals?: number;
    activeDeals?: number;
    totalOrders?: number;
}
