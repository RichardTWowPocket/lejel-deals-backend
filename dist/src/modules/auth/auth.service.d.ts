import { RegisterDto, OAuthGoogleDto } from './dto/auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    private formatUser;
    verifyCredentials(email: string, password: string): Promise<{
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
                permissions: Prisma.JsonValue;
                metadata: Prisma.JsonValue;
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
    registerUser(dto: RegisterDto): Promise<{
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
                permissions: Prisma.JsonValue;
                metadata: Prisma.JsonValue;
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
    getProfile(userId: string): Promise<{
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
            permissions: Prisma.JsonValue;
            metadata: Prisma.JsonValue;
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
    findOrCreateOAuthUser(dto: OAuthGoogleDto): Promise<{
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
                permissions: Prisma.JsonValue;
                metadata: Prisma.JsonValue;
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
