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
        const membership = await this.prisma.merchantMembership.findFirst({
            where: {
                userId: userId,
                merchantId: id,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You do not have access to update this merchant profile');
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
        const membership = await this.prisma.merchantMembership.findFirst({
            where: {
                userId: userId,
                merchantId: id,
                isOwner: true,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You do not have permission to delete this merchant. Only owners can delete merchants.');
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
            status: merchant.isActive
                ? merchant_verification_dto_1.VerificationStatus.VERIFIED
                : merchant_verification_dto_1.VerificationStatus.PENDING,
            verifiedAt: merchant.isActive ? merchant.createdAt : null,
            notes: merchant.isActive
                ? 'Merchant is active and verified'
                : 'Verification pending',
        };
    }
    async updateOperatingHours(id, operatingHours, userId) {
        const merchant = await this.findOne(id);
        const membership = await this.prisma.merchantMembership.findFirst({
            where: {
                userId: userId,
                merchantId: id,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You do not have access to update this merchant profile');
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
                {
                    day: 'wednesday',
                    openTime: '09:00',
                    closeTime: '22:00',
                    isOpen: true,
                },
                {
                    day: 'thursday',
                    openTime: '09:00',
                    closeTime: '22:00',
                    isOpen: true,
                },
                { day: 'friday', openTime: '09:00', closeTime: '22:00', isOpen: true },
                {
                    day: 'saturday',
                    openTime: '10:00',
                    closeTime: '23:00',
                    isOpen: true,
                },
                { day: 'sunday', openTime: '10:00', closeTime: '21:00', isOpen: true },
            ],
        };
    }
    async getMerchantStats(id) {
        const merchant = await this.findOne(id);
        const [totalDeals, activeDeals, totalOrders, totalRevenue, recentOrders] = await Promise.all([
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
    async getMerchantOverview(id) {
        await this.findOne(id);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const [todayOrders, todayRevenueAgg, totalRevenueAgg, activeDealsCount] = await Promise.all([
            this.prisma.order.count({
                where: {
                    deal: { merchantId: id },
                    createdAt: { gte: startOfDay, lte: endOfDay },
                    status: 'PAID',
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    deal: { merchantId: id },
                    createdAt: { gte: startOfDay, lte: endOfDay },
                    status: 'PAID',
                },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.aggregate({
                where: { deal: { merchantId: id }, status: 'PAID' },
                _sum: { totalAmount: true },
            }),
            this.prisma.deal.count({ where: { merchantId: id, status: 'ACTIVE' } }),
        ]);
        return {
            merchantId: id,
            todayOrders,
            todayRevenue: todayRevenueAgg._sum.totalAmount || 0,
            totalRevenue: totalRevenueAgg._sum.totalAmount || 0,
            activeDeals: activeDealsCount,
        };
    }
    async getMerchantPayouts(id, period = 'all') {
        await this.findOne(id);
        let gte;
        const now = new Date();
        switch (period) {
            case 'day': {
                gte = new Date();
                gte.setHours(0, 0, 0, 0);
                break;
            }
            case 'week': {
                gte = new Date(now);
                const day = gte.getDay();
                const diff = (day + 6) % 7;
                gte.setDate(gte.getDate() - diff);
                gte.setHours(0, 0, 0, 0);
                break;
            }
            case 'month': {
                gte = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            }
            case 'year': {
                gte = new Date(now.getFullYear(), 0, 1);
                break;
            }
            case 'all':
            default:
                gte = undefined;
        }
        const whereBase = { deal: { merchantId: id }, status: 'PAID' };
        if (gte)
            whereBase.createdAt = { gte };
        const [ordersCount, revenueAgg] = await Promise.all([
            this.prisma.order.count({ where: whereBase }),
            this.prisma.order.aggregate({
                where: whereBase,
                _sum: { totalAmount: true },
            }),
        ]);
        const grossRevenueRaw = revenueAgg._sum.totalAmount ?? 0;
        const grossRevenue = Number(grossRevenueRaw);
        const payoutAmount = Math.round(grossRevenue * 0.9);
        const platformFees = grossRevenue - payoutAmount;
        return {
            merchantId: id,
            period,
            orders: ordersCount,
            grossRevenue,
            payoutAmount,
            platformFees,
        };
    }
};
exports.MerchantsService = MerchantsService;
exports.MerchantsService = MerchantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MerchantsService);
//# sourceMappingURL=merchants.service.js.map