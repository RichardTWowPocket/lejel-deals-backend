export declare class NotificationPreferencesDto {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
    deals: boolean;
    orders: boolean;
    marketing: boolean;
}
export declare class CreateCustomerDto {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    preferences?: NotificationPreferencesDto;
    isActive?: boolean;
    metadata?: Record<string, any>;
}
