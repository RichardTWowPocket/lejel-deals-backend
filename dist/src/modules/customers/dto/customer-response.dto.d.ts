export declare class NotificationPreferencesResponseDto {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
    deals: boolean;
    orders: boolean;
    marketing: boolean;
}
export declare class CustomerResponseDto {
    id: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    preferences?: NotificationPreferencesResponseDto;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    totalOrders?: number;
    totalSpent?: number;
    lastOrderDate?: Date;
    favoriteCategories?: string[];
    tier?: string;
    loyaltyPoints?: number;
}
