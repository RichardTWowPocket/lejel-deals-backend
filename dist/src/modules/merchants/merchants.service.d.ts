import { PrismaService } from '../../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { MerchantVerificationDto, VerificationStatus } from './dto/merchant-verification.dto';
export declare class MerchantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMerchantDto: CreateMerchantDto, userId: string): Promise<{
        totalDeals: number;
        activeDeals: number;
        totalOrders: number;
        _count: {
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    findAll(page?: number, limit?: number, search?: string, city?: string, isActive?: boolean): Promise<{
        data: {
            totalDeals: number;
            activeDeals: number;
            totalOrders: number;
            _count: {
                deals: number;
            };
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            address: string | null;
            city: string | null;
            province: string | null;
            postalCode: string | null;
            website: string | null;
            logo: string | null;
            images: string[];
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        totalDeals: number;
        activeDeals: number;
        totalOrders: number;
        _count: {
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    findByEmail(email: string): Promise<{
        totalDeals: number;
        activeDeals: number;
        totalOrders: number;
        _count: {
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    update(id: string, updateMerchantDto: UpdateMerchantDto, userId: string): Promise<{
        totalDeals: number;
        activeDeals: number;
        totalOrders: number;
        _count: {
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    updateVerificationStatus(id: string, verificationDto: MerchantVerificationDto, adminId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    getVerificationStatus(id: string): Promise<{
        merchantId: string;
        status: VerificationStatus;
        verifiedAt: Date | null;
        notes: string;
    }>;
    updateOperatingHours(id: string, operatingHours: any[], userId: string): Promise<{
        operatingHours: any[];
        totalDeals: number;
        activeDeals: number;
        totalOrders: number;
        _count: {
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    getOperatingHours(id: string): Promise<{
        merchantId: string;
        operatingHours: {
            day: string;
            openTime: string;
            closeTime: string;
            isOpen: boolean;
        }[];
    }>;
    getMerchantStats(id: string): Promise<{
        merchantId: string;
        totalDeals: number;
        activeDeals: number;
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        recentOrders: ({
            deal: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                images: string[];
                title: string;
                dealPrice: import("@prisma/client/runtime/library").Decimal;
                discountPrice: import("@prisma/client/runtime/library").Decimal;
                validFrom: Date;
                validUntil: Date;
                status: import("@prisma/client").$Enums.DealStatus;
                maxQuantity: number | null;
                soldQuantity: number;
                terms: string | null;
                merchantId: string;
                categoryId: string | null;
            };
            customer: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                userId: string | null;
                firstName: string | null;
                lastName: string | null;
                dateOfBirth: Date | null;
                preferences: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            quantity: number;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: string | null;
            paymentReference: string | null;
            customerId: string;
            dealId: string;
        })[];
    }>;
    searchMerchants(query: string, filters?: any): Promise<({
        _count: {
            deals: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    })[]>;
    deactivate(id: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
    reactivate(id: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        website: string | null;
        logo: string | null;
        images: string[];
    }>;
}
