import { StaffRole } from '@prisma/client';
export declare class CreateStaffDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    pin: string;
    role?: StaffRole;
    merchantId?: string;
    permissions?: any;
    metadata?: any;
}
export declare class UpdateStaffDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    pin?: string;
    role?: StaffRole;
    merchantId?: string;
    permissions?: any;
    metadata?: any;
    isActive?: boolean;
}
export declare class StaffLoginDto {
    identifier: string;
    pin: string;
}
export declare class StaffResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: StaffRole;
    isActive: boolean;
    lastLoginAt?: Date;
    merchantId?: string;
    merchant?: {
        id: string;
        name: string;
        email: string;
    };
    permissions?: any;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
export declare class StaffLoginResponseDto {
    staff: StaffResponseDto;
    accessToken: string;
    expiresIn: number;
}
export declare class StaffStatsDto {
    totalStaff: number;
    activeStaff: number;
    staffByRole: {
        MANAGER: number;
        CASHIER: number;
        SUPERVISOR: number;
        ADMIN: number;
    };
    staffByMerchant: Array<{
        merchantId: string;
        merchantName: string;
        staffCount: number;
    }>;
    recentLogins: number;
    activitySummary: {
        totalRedemptions: number;
        averageRedemptionsPerStaff: number;
        mostActiveStaff: Array<{
            staffId: string;
            staffName: string;
            redemptions: number;
        }>;
    };
}
export declare class ChangePinDto {
    currentPin: string;
    newPin: string;
}
export declare class StaffActivityDto {
    activityType: string;
    description: string;
    entityId?: string;
    metadata?: any;
    timestamp: Date;
}
