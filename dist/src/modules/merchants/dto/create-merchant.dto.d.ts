export declare class OperatingHoursDto {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}
export declare class CreateMerchantDto {
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
    images?: string[];
    operatingHours?: OperatingHoursDto[];
    isActive?: boolean;
}
