import { AuthService } from './auth.service';
import type { AuthUser } from './types';
import { RegisterDto, OAuthGoogleDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    healthCheck(): {
        status: string;
        message: string;
    };
    verifyCredentials(body: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            avatar: string | null;
            provider: string | null;
            merchantIds: string[];
            merchantMemberships: {
                id: string;
                merchantId: string;
                merchantRole: import("@prisma/client").$Enums.MerchantRole;
                isOwner: boolean;
                permissions: import("@prisma/client/runtime/library").JsonValue;
                metadata: import("@prisma/client/runtime/library").JsonValue;
                createdAt: Date;
                merchant: {
                    id: string;
                    name: string;
                    email: string;
                    isActive: boolean;
                } | null;
            }[];
            customerId: string | null;
            customer: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
                phone: string | null;
                isActive: boolean;
            } | null;
        };
    }>;
    register(body: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            avatar: string | null;
            provider: string | null;
            merchantIds: string[];
            merchantMemberships: {
                id: string;
                merchantId: string;
                merchantRole: import("@prisma/client").$Enums.MerchantRole;
                isOwner: boolean;
                permissions: import("@prisma/client/runtime/library").JsonValue;
                metadata: import("@prisma/client/runtime/library").JsonValue;
                createdAt: Date;
                merchant: {
                    id: string;
                    name: string;
                    email: string;
                    isActive: boolean;
                } | null;
            }[];
            customerId: string | null;
            customer: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
                phone: string | null;
                isActive: boolean;
            } | null;
        };
    }>;
    getProfile(user: AuthUser): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        avatar: string | null;
        provider: string | null;
        merchantIds: string[];
        merchantMemberships: {
            id: string;
            merchantId: string;
            merchantRole: import("@prisma/client").$Enums.MerchantRole;
            isOwner: boolean;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            metadata: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            merchant: {
                id: string;
                name: string;
                email: string;
                isActive: boolean;
            } | null;
        }[];
        customerId: string | null;
        customer: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            isActive: boolean;
        } | null;
    }>;
    oauthGoogle(body: OAuthGoogleDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            avatar: string | null;
            provider: string | null;
            merchantIds: string[];
            merchantMemberships: {
                id: string;
                merchantId: string;
                merchantRole: import("@prisma/client").$Enums.MerchantRole;
                isOwner: boolean;
                permissions: import("@prisma/client/runtime/library").JsonValue;
                metadata: import("@prisma/client/runtime/library").JsonValue;
                createdAt: Date;
                merchant: {
                    id: string;
                    name: string;
                    email: string;
                    isActive: boolean;
                } | null;
            }[];
            customerId: string | null;
            customer: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
                phone: string | null;
                isActive: boolean;
            } | null;
        };
    }>;
}
