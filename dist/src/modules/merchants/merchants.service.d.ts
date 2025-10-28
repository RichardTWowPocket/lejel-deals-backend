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
    getMerchantOverview(id: string): Promise<{
        merchant: {
            id: string;
            name: string;
            email: string;
        };
        today: {
            orders: number;
            redemptions: number;
            revenue: number;
            voucherValueRedeemed: number;
            ordersDetails: ({
                deal: {
                    id: string;
                    title: string;
                    discountPrice: import("@prisma/client/runtime/library").Decimal;
                };
                customer: {
                    id: string;
                    email: string;
                    firstName: string | null;
                    lastName: string | null;
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
            redemptionsDetails: ({
                staff: {
                    id: string;
                    role: import("@prisma/client").$Enums.StaffRole;
                    firstName: string;
                    lastName: string;
                } | null;
                coupon: {
                    deal: {
                        id: string;
                        title: string;
                        discountPrice: import("@prisma/client/runtime/library").Decimal;
                    };
                    order: {
                        orderNumber: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    status: import("@prisma/client").$Enums.CouponStatus;
                    dealId: string;
                    qrCode: string;
                    usedAt: Date | null;
                    expiresAt: Date;
                    orderId: string;
                };
            } & {
                id: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.RedemptionStatus;
                notes: string | null;
                couponId: string;
                staffId: string | null;
                location: string | null;
                redeemedAt: Date;
            })[];
        };
        activeDeals: number;
        activeDealsList: {
            id: string;
            title: string;
            dealPrice: import("@prisma/client/runtime/library").Decimal;
            discountPrice: import("@prisma/client/runtime/library").Decimal;
            validUntil: Date;
            maxQuantity: number | null;
            soldQuantity: number;
        }[];
        lowInventoryDeals: {
            id: string;
            title: string;
            remaining: number;
            total: number;
            percentageLeft: number;
        }[];
        expiringSoonDeals: {
            id: string;
            title: string;
            expiresAt: Date;
        }[];
        redemptionRate: number;
        alerts: {
            lowInventory: number;
            expiringSoon: number;
            hasAlerts: boolean;
        };
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
    getMerchantPayouts(id: string, period?: 'day' | 'week' | 'month' | 'year' | 'all'): Promise<{
        merchant: {
            id: string;
            name: string;
        };
        summary: {
            period: "day" | "week" | "month" | "year" | "all" | undefined;
            startDate: string;
            endDate: string;
            totalRevenue: number;
            totalOrders: number;
            averageOrderValue: number;
            topDeals: {
                dealId: string;
                dealTitle: string;
                orders: number;
                revenue: number;
            }[];
        };
        orders: ({
            deal: {
                id: string;
                title: string;
                dealPrice: import("@prisma/client/runtime/library").Decimal;
                discountPrice: import("@prisma/client/runtime/library").Decimal;
            };
            customer: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
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
        dailyTrends: {
            date: string;
            orders: number;
            revenue: number;
            averageOrderValue: number;
        }[];
        totalRecords: number;
    }>;
}
