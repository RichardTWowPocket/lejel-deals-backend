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
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DealsService = class DealsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDealDto, userId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: createDealDto.merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException(`Merchant with ID ${createDealDto.merchantId} not found`);
        }
        if (createDealDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: createDealDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${createDealDto.categoryId} not found`);
            }
        }
        const validFrom = new Date(createDealDto.validFrom);
        const validUntil = new Date(createDealDto.validUntil);
        if (validFrom >= validUntil) {
            throw new common_1.BadRequestException('validFrom must be before validUntil');
        }
        const deal = await this.prisma.deal.create({
            data: {
                title: createDealDto.title,
                description: createDealDto.description,
                dealPrice: createDealDto.dealPrice,
                discountPrice: createDealDto.discountPrice,
                validFrom,
                validUntil,
                status: createDealDto.status || client_1.DealStatus.DRAFT,
                maxQuantity: createDealDto.maxQuantity,
                soldQuantity: 0,
                images: createDealDto.images || [],
                terms: createDealDto.terms,
                merchantId: createDealDto.merchantId,
                categoryId: createDealDto.categoryId,
            },
            include: {
                merchant: true,
                category: true,
            },
        });
        return this.mapDealToResponse(deal);
    }
    async findAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 12;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.merchantId) {
            where.merchantId = filters.merchantId;
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.status === client_1.DealStatus.ACTIVE) {
            where.status = client_1.DealStatus.ACTIVE;
            where.validFrom = { lte: new Date() };
            where.validUntil = { gte: new Date() };
        }
        const orderBy = {};
        if (filters.sortBy) {
            const sortField = filters.sortBy;
            const sortOrder = filters.sortOrder || 'desc';
            switch (sortField) {
                case 'discountedPrice':
                    orderBy.dealPrice = sortOrder;
                    break;
                case 'discountPercentage':
                    orderBy.dealPrice = sortOrder === 'desc' ? 'asc' : 'desc';
                    break;
                case 'popularity':
                    orderBy.soldQuantity = sortOrder;
                    break;
                default:
                    orderBy[sortField] = sortOrder;
            }
        }
        else {
            orderBy.createdAt = 'desc';
        }
        const [deals, total] = await Promise.all([
            this.prisma.deal.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            logo: true,
                            address: true,
                            city: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            icon: true,
                        },
                    },
                    _count: {
                        select: {
                            orders: true,
                        },
                    },
                },
            }),
            this.prisma.deal.count({ where }),
        ]);
        return {
            deals: deals.map((deal) => this.mapDealToResponse(deal)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const deal = await this.prisma.deal.findUnique({
            where: { id },
            include: {
                merchant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        logo: true,
                        address: true,
                        city: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        icon: true,
                    },
                },
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
        if (!deal) {
            throw new common_1.NotFoundException(`Deal with ID ${id} not found`);
        }
        return this.mapDealToResponse(deal);
    }
    async findBySlug(slug) {
        const deals = await this.prisma.deal.findMany({
            where: {
                title: {
                    contains: slug.replace(/-/g, ' '),
                    mode: 'insensitive',
                },
            },
            include: {
                merchant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        logo: true,
                        address: true,
                        city: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        icon: true,
                    },
                },
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
            take: 1,
        });
        if (!deals || deals.length === 0) {
            throw new common_1.NotFoundException(`Deal with slug ${slug} not found`);
        }
        return this.mapDealToResponse(deals[0]);
    }
    async findActive(page = 1, limit = 12) {
        return this.findAll({
            status: client_1.DealStatus.ACTIVE,
            page,
            limit,
        });
    }
    async findByStatus(status, page = 1, limit = 12) {
        return this.findAll({
            status,
            page,
            limit,
        });
    }
    async findByMerchant(merchantId, page = 1, limit = 12) {
        return this.findAll({
            merchantId,
            page,
            limit,
        });
    }
    async findByCategory(categoryId, page = 1, limit = 12) {
        return this.findAll({
            categoryId,
            page,
            limit,
        });
    }
    async update(id, updateDealDto, userId) {
        const existingDeal = await this.prisma.deal.findUnique({
            where: { id },
        });
        if (!existingDeal) {
            throw new common_1.NotFoundException(`Deal with ID ${id} not found`);
        }
        if (updateDealDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: updateDealDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${updateDealDto.categoryId} not found`);
            }
        }
        if (updateDealDto.validFrom || updateDealDto.validUntil) {
            const validFrom = updateDealDto.validFrom ? new Date(updateDealDto.validFrom) : existingDeal.validFrom;
            const validUntil = updateDealDto.validUntil ? new Date(updateDealDto.validUntil) : existingDeal.validUntil;
            if (validFrom >= validUntil) {
                throw new common_1.BadRequestException('validFrom must be before validUntil');
            }
        }
        const updated = await this.prisma.deal.update({
            where: { id },
            data: {
                ...(updateDealDto.title && { title: updateDealDto.title }),
                ...(updateDealDto.description !== undefined && { description: updateDealDto.description }),
                ...(updateDealDto.dealPrice && { dealPrice: updateDealDto.dealPrice }),
                ...(updateDealDto.discountPrice && { discountPrice: updateDealDto.discountPrice }),
                ...(updateDealDto.validFrom && { validFrom: new Date(updateDealDto.validFrom) }),
                ...(updateDealDto.validUntil && { validUntil: new Date(updateDealDto.validUntil) }),
                ...(updateDealDto.status && { status: updateDealDto.status }),
                ...(updateDealDto.maxQuantity !== undefined && { maxQuantity: updateDealDto.maxQuantity }),
                ...(updateDealDto.images && { images: updateDealDto.images }),
                ...(updateDealDto.terms !== undefined && { terms: updateDealDto.terms }),
                ...(updateDealDto.categoryId !== undefined && { categoryId: updateDealDto.categoryId }),
            },
            include: {
                merchant: true,
                category: true,
            },
        });
        return this.mapDealToResponse(updated);
    }
    async updateStatus(id, updateStatusDto, userId) {
        const deal = await this.prisma.deal.findUnique({
            where: { id },
        });
        if (!deal) {
            throw new common_1.NotFoundException(`Deal with ID ${id} not found`);
        }
        this.validateStatusTransition(deal.status, updateStatusDto.status);
        const updated = await this.prisma.deal.update({
            where: { id },
            data: { status: updateStatusDto.status },
            include: {
                merchant: true,
                category: true,
            },
        });
        return this.mapDealToResponse(updated);
    }
    async publish(id, userId) {
        return this.updateStatus(id, { status: client_1.DealStatus.ACTIVE }, userId);
    }
    async pause(id, userId) {
        return this.updateStatus(id, { status: client_1.DealStatus.PAUSED }, userId);
    }
    async remove(id, userId) {
        const deal = await this.prisma.deal.findUnique({
            where: { id },
        });
        if (!deal) {
            throw new common_1.NotFoundException(`Deal with ID ${id} not found`);
        }
        await this.prisma.deal.update({
            where: { id },
            data: { status: client_1.DealStatus.EXPIRED },
        });
    }
    async checkExpiredDeals() {
        const now = new Date();
        const result = await this.prisma.deal.updateMany({
            where: {
                status: client_1.DealStatus.ACTIVE,
                validUntil: { lt: now },
            },
            data: {
                status: client_1.DealStatus.EXPIRED,
            },
        });
        return { updated: result.count };
    }
    async checkSoldOutDeals() {
        const deals = await this.prisma.deal.findMany({
            where: {
                status: client_1.DealStatus.ACTIVE,
                maxQuantity: { not: null },
            },
            select: {
                id: true,
                maxQuantity: true,
                soldQuantity: true,
            },
        });
        let updated = 0;
        for (const deal of deals) {
            if (deal.maxQuantity && deal.soldQuantity >= deal.maxQuantity) {
                await this.prisma.deal.update({
                    where: { id: deal.id },
                    data: { status: client_1.DealStatus.SOLD_OUT },
                });
                updated++;
            }
        }
        return { updated };
    }
    async getStats() {
        const [total, active, draft, paused, expired, soldOut] = await Promise.all([
            this.prisma.deal.count(),
            this.prisma.deal.count({ where: { status: client_1.DealStatus.ACTIVE } }),
            this.prisma.deal.count({ where: { status: client_1.DealStatus.DRAFT } }),
            this.prisma.deal.count({ where: { status: client_1.DealStatus.PAUSED } }),
            this.prisma.deal.count({ where: { status: client_1.DealStatus.EXPIRED } }),
            this.prisma.deal.count({ where: { status: client_1.DealStatus.SOLD_OUT } }),
        ]);
        return {
            total,
            active,
            draft,
            paused,
            expired,
            soldOut,
        };
    }
    validateStatusTransition(currentStatus, newStatus) {
        const allowedTransitions = {
            [client_1.DealStatus.DRAFT]: [client_1.DealStatus.ACTIVE],
            [client_1.DealStatus.ACTIVE]: [client_1.DealStatus.PAUSED, client_1.DealStatus.EXPIRED, client_1.DealStatus.SOLD_OUT],
            [client_1.DealStatus.PAUSED]: [client_1.DealStatus.ACTIVE, client_1.DealStatus.EXPIRED],
            [client_1.DealStatus.EXPIRED]: [],
            [client_1.DealStatus.SOLD_OUT]: [],
        };
        if (!allowedTransitions[currentStatus].includes(newStatus)) {
            throw new common_1.BadRequestException(`Cannot transition from ${currentStatus} to ${newStatus}`);
        }
    }
    mapDealToResponse(deal) {
        const quantityAvailable = deal.maxQuantity ? deal.maxQuantity - deal.soldQuantity : 999999;
        const dealPriceValue = Number(deal.dealPrice);
        const discountPriceValue = Number(deal.discountPrice);
        const realDiscountPercentage = discountPriceValue > 0
            ? Math.round(((discountPriceValue - dealPriceValue) / discountPriceValue) * 100)
            : 0;
        const slug = this.generateSlug(deal.title, deal.id);
        const firstImage = deal.images && deal.images.length > 0 ? deal.images[0] : '';
        const shortDescription = deal.description
            ? deal.description.substring(0, 150) + (deal.description.length > 150 ? '...' : '')
            : null;
        const highlights = [];
        if (deal.terms) {
            const termLines = deal.terms.split('.').filter(t => t.trim().length > 0);
            termLines.forEach(line => {
                if (line.trim().length > 10 && line.trim().length < 100) {
                    highlights.push(line.trim());
                }
            });
        }
        return {
            id: deal.id,
            slug,
            title: deal.title,
            description: deal.description,
            shortDescription,
            dealPrice: dealPriceValue,
            discountPrice: discountPriceValue,
            discountedPrice: discountPriceValue,
            originalPrice: discountPriceValue,
            discountPercentage: realDiscountPercentage,
            images: deal.images || [],
            thumbnailUrl: firstImage,
            validFrom: deal.validFrom,
            validUntil: deal.validUntil,
            redemptionDeadline: deal.validUntil,
            status: deal.status,
            type: 'voucher',
            featured: false,
            maxQuantity: deal.maxQuantity,
            soldQuantity: deal.soldQuantity,
            quantityAvailable,
            quantity: deal.maxQuantity || 999999,
            terms: deal.terms,
            highlights: highlights.length > 0 ? highlights : undefined,
            merchantId: deal.merchantId,
            merchant: deal.merchant
                ? {
                    id: deal.merchant.id,
                    businessName: deal.merchant.name,
                    slug: this.generateSlug(deal.merchant.name, deal.merchant.id),
                    logoUrl: deal.merchant.logo,
                    address: deal.merchant.address,
                }
                : undefined,
            categoryId: deal.categoryId,
            category: deal.category
                ? {
                    id: deal.category.id,
                    name: deal.category.name,
                    slug: this.generateSlug(deal.category.name, deal.category.id),
                }
                : undefined,
            createdAt: deal.createdAt,
            updatedAt: deal.updatedAt,
            _count: deal._count,
        };
    }
    generateSlug(title, id) {
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        return `${slug}-${id.slice(-8)}`;
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DealsService);
//# sourceMappingURL=deals.service.js.map