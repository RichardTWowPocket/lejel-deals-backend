"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const merchant_verification_dto_1 = require("./dto/merchant-verification.dto");
let MerchantsService = class MerchantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMerchantDto, userId) {
        const existingMerchant = await this.prisma.merchant.findUnique({
            where: { email: createMerchantDto.email },
        });
        if (existingMerchant) {
            throw new common_1.BadRequestException('Merchant with this email already exists');
        }
        const { operatingHours, ...merchantData } = createMerchantDto;
        const merchant = await this.prisma.merchant.create({
            data: {
                ...merchantData,
                images: merchantData.images || [],
            },
        });
        return this.findOne(merchant.id);
    }
    async findAll(page = 1, limit = 10, search, city, isActive) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        const [merchants, total] = await Promise.all([
            this.prisma.merchant.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            deals: true,
                        },
                    },
                },
            }),
            this.prisma.merchant.count({ where }),
        ]);
        const merchantsWithStats = await Promise.all(merchants.map(async (merchant) => {
            const activeDeals = await this.prisma.deal.count({
                where: {
                    merchantId: merchant.id,
                    status: 'ACTIVE',
                },
            });
            const totalOrders = await this.prisma.order.count({
                where: {
                    deal: {
                        merchantId: merchant.id,
                    },
                },
            });
            return {
                ...merchant,
                totalDeals: merchant._count.deals,
                activeDeals,
                totalOrders,
            };
        }));
        return {
            data: merchantsWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        deals: true,
                    },
                },
            },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        const activeDeals = await this.prisma.deal.count({
            where: {
                merchantId: merchant.id,
                status: 'ACTIVE',
            },
        });
        const totalOrders = await this.prisma.order.count({
            where: {
                deal: {
                    merchantId: merchant.id,
                },
            },
        });
        return {
            ...merchant,
            totalDeals: merchant._count.deals,
            activeDeals,
            totalOrders,
        };
    }
    async findByEmail(email) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { email },
            include: {
                _count: {
                    select: {
                        deals: true,
                    },
                },
            },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        return this.findOne(merchant.id);
    }
    async update(id, updateMerchantDto, userId) {
        const merchant = await this.findOne(id);
        if (merchant.email !== userId) {
            throw new common_1.ForbiddenException('You can only update your own merchant profile');
        }
        if (updateMerchantDto.email && updateMerchantDto.email !== merchant.email) {
            const existingMerchant = await this.prisma.merchant.findUnique({
                where: { email: updateMerchantDto.email },
            });
            if (existingMerchant) {
                throw new common_1.BadRequestException('Email is already taken by another merchant');
            }
        }
        const { operatingHours, ...merchantData } = updateMerchantDto;
        const updatedMerchant = await this.prisma.merchant.update({
            where: { id },
            data: {
                ...merchantData,
            },
        });
        return this.findOne(updatedMerchant.id);
    }
    async remove(id, userId) {
        const merchant = await this.findOne(id);
        if (merchant.email !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own merchant profile');
        }
        const activeDeals = await this.prisma.deal.count({
            where: {
                merchantId: id,
                status: 'ACTIVE',
            },
        });
        if (activeDeals > 0) {
            throw new common_1.BadRequestException('Cannot delete merchant with active deals. Please deactivate or delete all active deals first.');
        }
        return this.prisma.merchant.delete({
            where: { id },
        });
    }
    async updateVerificationStatus(id, verificationDto, adminId) {
        const merchant = await this.findOne(id);
        const isActive = verificationDto.status === merchant_verification_dto_1.VerificationStatus.VERIFIED;
        return this.prisma.merchant.update({
            where: { id },
            data: {
                isActive,
            },
        });
    }
    async getVerificationStatus(id) {
        const merchant = await this.findOne(id);
        return {
            merchantId: id,
            status: merchant.isActive ? merchant_verification_dto_1.VerificationStatus.VERIFIED : merchant_verification_dto_1.VerificationStatus.PENDING,
            verifiedAt: merchant.isActive ? merchant.createdAt : null,
            notes: merchant.isActive ? 'Merchant is active and verified' : 'Verification pending',
        };
    }
    async updateOperatingHours(id, operatingHours, userId) {
        const merchant = await this.findOne(id);
        if (merchant.email !== userId) {
            throw new common_1.ForbiddenException('You can only update your own merchant profile');
        }
        return {
            ...merchant,
            operatingHours,
        };
    }
    async getOperatingHours(id) {
        const merchant = await this.findOne(id);
        return {
            merchantId: id,
            operatingHours: [
                { day: 'monday', openTime: '09:00', closeTime: '22:00', isOpen: true },
                { day: 'tuesday', openTime: '09:00', closeTime: '22:00', isOpen: true },
                { day: 'wednesday', openTime: '09:00', closeTime: '22:00', isOpen: true },
                { day: 'thursday', openTime: '09:00', closeTime: '22:00', isOpen: true },
                { day: 'friday', openTime: '09:00', closeTime: '22:00', isOpen: true },
                { day: 'saturday', openTime: '10:00', closeTime: '23:00', isOpen: true },
                { day: 'sunday', openTime: '10:00', closeTime: '21:00', isOpen: true },
            ],
        };
    }
    async getMerchantStats(id) {
        const merchant = await this.findOne(id);
        const [totalDeals, activeDeals, totalOrders, totalRevenue, recentOrders,] = await Promise.all([
            this.prisma.deal.count({
                where: { merchantId: id },
            }),
            this.prisma.deal.count({
                where: { merchantId: id, status: 'ACTIVE' },
            }),
            this.prisma.order.count({
                where: {
                    deal: { merchantId: id },
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    deal: { merchantId: id },
                    status: 'PAID',
                },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.findMany({
                where: {
                    deal: { merchantId: id },
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    deal: true,
                    customer: true,
                },
            }),
        ]);
        return {
            merchantId: id,
            totalDeals,
            activeDeals,
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            recentOrders,
        };
    }
    async getMerchantOverview(id) {
        const merchant = await this.findOne(id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const allDeals = await this.prisma.deal.findMany({
            where: { merchantId: id },
            select: { id: true },
        });
        const dealIds = allDeals.map(d => d.id);
        const [todayOrders, todayRedemptions, todayRevenue, todayOrdersDetails,] = await Promise.all([
            this.prisma.order.count({
                where: {
                    dealId: { in: dealIds },
                    createdAt: { gte: today, lt: tomorrow },
                    status: 'PAID',
                },
            }),
            this.prisma.redemption.count({
                where: {
                    coupon: {
                        dealId: { in: dealIds },
                    },
                    redeemedAt: { gte: today, lt: tomorrow },
                    status: 'COMPLETED',
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    dealId: { in: dealIds },
                    createdAt: { gte: today, lt: tomorrow },
                    status: 'PAID',
                },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.findMany({
                where: {
                    dealId: { in: dealIds },
                    createdAt: { gte: today, lt: tomorrow },
                },
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    deal: {
                        select: {
                            id: true,
                            title: true,
                            discountPrice: true,
                        },
                    },
                    customer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            }),
        ]);
        const activeDeals = await this.prisma.deal.findMany({
            where: {
                merchantId: id,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                title: true,
                validUntil: true,
                soldQuantity: true,
                maxQuantity: true,
                dealPrice: true,
                discountPrice: true,
            },
        });
        const lowInventoryDeals = activeDeals
            .filter(deal => {
            if (!deal.maxQuantity)
                return false;
            const percentageLeft = ((deal.maxQuantity - deal.soldQuantity) / deal.maxQuantity) * 100;
            return percentageLeft < 20 && percentageLeft > 0;
        })
            .map(deal => ({
            id: deal.id,
            title: deal.title,
            remaining: deal.maxQuantity - deal.soldQuantity,
            total: deal.maxQuantity,
            percentageLeft: ((deal.maxQuantity - deal.soldQuantity) / deal.maxQuantity) * 100,
        }));
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        const expiringSoonDeals = activeDeals
            .filter(deal => {
            const expiresAt = new Date(deal.validUntil);
            return expiresAt <= sevenDaysFromNow && expiresAt > new Date();
        })
            .map(deal => ({
            id: deal.id,
            title: deal.title,
            expiresAt: deal.validUntil,
        }));
        const todayRedemptionsDetails = await this.prisma.redemption.findMany({
            where: {
                coupon: {
                    dealId: { in: dealIds },
                },
                redeemedAt: { gte: today, lt: tomorrow },
                status: 'COMPLETED',
            },
            take: 10,
            orderBy: { redeemedAt: 'desc' },
            include: {
                coupon: {
                    include: {
                        deal: {
                            select: {
                                id: true,
                                title: true,
                                discountPrice: true,
                            },
                        },
                        order: {
                            select: {
                                orderNumber: true,
                            },
                        },
                    },
                },
                staff: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
        });
        const voucherValueRedeemedToday = todayRedemptionsDetails.reduce((sum, redemption) => {
            return sum + Number(redemption.coupon.deal.discountPrice || 0);
        }, 0);
        const totalCoupons = await this.prisma.coupon.count({
            where: {
                dealId: { in: dealIds },
            },
        });
        const usedCoupons = await this.prisma.coupon.count({
            where: {
                dealId: { in: dealIds },
                status: 'USED',
            },
        });
        const redemptionRate = totalCoupons > 0
            ? (usedCoupons / totalCoupons) * 100
            : 0;
        return {
            merchant: {
                id: merchant.id,
                name: merchant.name,
                email: merchant.email,
            },
            today: {
                orders: todayOrders,
                redemptions: todayRedemptions,
                revenue: Number(todayRevenue._sum.totalAmount || 0),
                voucherValueRedeemed: voucherValueRedeemedToday,
                ordersDetails: todayOrdersDetails,
                redemptionsDetails: todayRedemptionsDetails,
            },
            activeDeals: activeDeals.length,
            activeDealsList: activeDeals,
            lowInventoryDeals,
            expiringSoonDeals,
            redemptionRate: Math.round(redemptionRate * 100) / 100,
            alerts: {
                lowInventory: lowInventoryDeals.length,
                expiringSoon: expiringSoonDeals.length,
                hasAlerts: lowInventoryDeals.length > 0 || expiringSoonDeals.length > 0,
            },
        };
    }
    async searchMerchants(query, filters = {}) {
        const where = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
                { province: { contains: query, mode: 'insensitive' } },
            ],
        };
        if (filters.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        return this.prisma.merchant.findMany({
            where,
            include: {
                _count: {
                    select: {
                        deals: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deactivate(id, userId) {
        const merchant = await this.findOne(id);
        if (merchant.email !== userId) {
            throw new common_1.ForbiddenException('You can only deactivate your own merchant profile');
        }
        return this.prisma.merchant.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async reactivate(id, userId) {
        const merchant = await this.findOne(id);
        if (merchant.email !== userId) {
            throw new common_1.ForbiddenException('You can only reactivate your own merchant profile');
        }
        return this.prisma.merchant.update({
            where: { id },
            data: { isActive: true },
        });
    }
    async getMerchantPayouts(id, period) {
        const merchant = await this.findOne(id);
        const allDeals = await this.prisma.deal.findMany({
            where: { merchantId: id },
            select: { id: true },
        });
        const dealIds = allDeals.map(d => d.id);
        const now = new Date();
        let startDate = new Date();
        if (period === 'day') {
            startDate.setHours(0, 0, 0, 0);
        }
        else if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        }
        else if (period === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        }
        else if (period === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }
        else {
            startDate = new Date(0);
        }
        const orders = await this.prisma.order.findMany({
            where: {
                dealId: { in: dealIds },
                createdAt: { gte: startDate },
                status: 'PAID',
            },
            include: {
                deal: {
                    select: {
                        id: true,
                        title: true,
                        dealPrice: true,
                        discountPrice: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const ordersByDate = orders.reduce((acc, order) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { orders: 0, revenue: 0 };
            }
            acc[date].orders += 1;
            acc[date].revenue += Number(order.totalAmount);
            return acc;
        }, {});
        const dailyTrends = Object.entries(ordersByDate).map(([date, data]) => ({
            date,
            orders: data.orders,
            revenue: data.revenue,
            averageOrderValue: data.revenue / data.orders,
        }));
        const dealRevenue = orders.reduce((acc, order) => {
            const dealId = order.dealId;
            if (!acc[dealId]) {
                acc[dealId] = {
                    dealId,
                    dealTitle: order.deal.title,
                    orders: 0,
                    revenue: 0,
                };
            }
            acc[dealId].orders += 1;
            acc[dealId].revenue += Number(order.totalAmount);
            return acc;
        }, {});
        const topDeals = Object.values(dealRevenue)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
        const summary = {
            period,
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
            totalRevenue,
            totalOrders,
            averageOrderValue,
            topDeals,
        };
        return {
            merchant: {
                id: merchant.id,
                name: merchant.name,
            },
            summary,
            orders: orders.slice(0, 50),
            dailyTrends,
            totalRecords: orders.length,
        };
    }
};
exports.MerchantsService = MerchantsService;
exports.MerchantsService = MerchantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MerchantsService);
//# sourceMappingURL=merchants.service.js.map