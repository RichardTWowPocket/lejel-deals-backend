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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CouponsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const qrcode_1 = __importDefault(require("qrcode"));
let CouponsService = CouponsService_1 = class CouponsService {
    prisma;
    logger = new common_1.Logger(CouponsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, status, orderId, dealId) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (orderId)
            where.orderId = orderId;
        if (dealId)
            where.dealId = dealId;
        const [coupons, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    order: {
                        select: {
                            orderNumber: true,
                            customer: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    deal: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            dealPrice: true,
                            discountPrice: true,
                            images: true,
                            validUntil: true,
                            status: true,
                            merchant: {
                                select: {
                                    id: true,
                                    name: true,
                                    logo: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.coupon.count({ where }),
        ]);
        return {
            coupons: coupons.map((coupon) => this.mapToCouponResponseDto(coupon)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                deal: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        dealPrice: true,
                        discountPrice: true,
                        images: true,
                        validUntil: true,
                        status: true,
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return this.mapToCouponResponseDto(coupon);
    }
    async findByQRCode(qrCode) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { qrCode },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                deal: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        dealPrice: true,
                        discountPrice: true,
                        images: true,
                        validUntil: true,
                        status: true,
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return this.mapToCouponResponseDto(coupon);
    }
    async findByOrder(orderId) {
        const coupons = await this.prisma.coupon.findMany({
            where: { orderId },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                deal: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        dealPrice: true,
                        discountPrice: true,
                        images: true,
                        validUntil: true,
                        status: true,
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return coupons.map((coupon) => this.mapToCouponResponseDto(coupon));
    }
    async findMine(userId, page = 1, limit = 10, status) {
        const customer = await this.prisma.customer.findFirst({
            where: { userId },
        });
        if (!customer) {
            return {
                coupons: [],
                pagination: { page, limit, total: 0, totalPages: 0 },
            };
        }
        const skip = (page - 1) * limit;
        const where = { order: { customerId: customer.id } };
        if (status) {
            where.status = status;
        }
        const [coupons, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    order: {
                        select: {
                            orderNumber: true,
                            customer: {
                                select: { firstName: true, lastName: true, email: true },
                            },
                        },
                    },
                    deal: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            dealPrice: true,
                            discountPrice: true,
                            images: true,
                            validUntil: true,
                            status: true,
                            merchant: {
                                select: {
                                    id: true,
                                    name: true,
                                    logo: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.coupon.count({ where }),
        ]);
        return {
            coupons: coupons.map((c) => this.mapToCouponResponseDto(c)),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async validateCoupon(qrCode) {
        try {
            const coupon = await this.findByQRCode(qrCode);
            if (coupon.status !== client_1.CouponStatus.ACTIVE) {
                return {
                    isValid: false,
                    error: `Coupon is ${coupon.status.toLowerCase()}`,
                };
            }
            if (new Date() > coupon.expiresAt) {
                return {
                    isValid: false,
                    error: 'Coupon has expired',
                };
            }
            if (coupon.usedAt) {
                return {
                    isValid: false,
                    error: 'Coupon has already been used',
                };
            }
            return {
                isValid: true,
                coupon,
            };
        }
        catch (error) {
            return {
                isValid: false,
                error: 'Invalid coupon QR code',
            };
        }
    }
    async redeemCoupon(qrCode, redeemedByUserId, notes) {
        const validation = await this.validateCoupon(qrCode);
        if (!validation.isValid) {
            throw new common_1.BadRequestException(validation.error);
        }
        const coupon = validation.coupon;
        const updatedCoupon = await this.prisma.coupon.update({
            where: { id: coupon.id },
            data: {
                status: client_1.CouponStatus.USED,
                usedAt: new Date(),
            },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                deal: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        dealPrice: true,
                        discountPrice: true,
                        images: true,
                        validUntil: true,
                        status: true,
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
        });
        await this.prisma.redemption.create({
            data: {
                couponId: coupon.id,
                redeemedByUserId: redeemedByUserId || null,
                notes,
            },
        });
        this.logger.log(`Coupon ${coupon.id} redeemed successfully`);
        return this.mapToCouponResponseDto(updatedCoupon);
    }
    async cancelCoupon(id, reason) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        if (coupon.status !== client_1.CouponStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active coupons can be cancelled');
        }
        const updatedCoupon = await this.prisma.coupon.update({
            where: { id },
            data: {
                status: client_1.CouponStatus.CANCELLED,
            },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                deal: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        dealPrice: true,
                        discountPrice: true,
                        images: true,
                        validUntil: true,
                        status: true,
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
        });
        this.logger.log(`Coupon ${id} cancelled: ${reason || 'No reason provided'}`);
        return this.mapToCouponResponseDto(updatedCoupon);
    }
    async expireCoupons() {
        const now = new Date();
        const result = await this.prisma.coupon.updateMany({
            where: {
                status: client_1.CouponStatus.ACTIVE,
                expiresAt: {
                    lt: now,
                },
            },
            data: {
                status: client_1.CouponStatus.EXPIRED,
            },
        });
        this.logger.log(`Expired ${result.count} coupons`);
        return result.count;
    }
    async getStats() {
        const [totalCoupons, activeCoupons, usedCoupons, expiredCoupons, cancelledCoupons, totalRedemptions,] = await Promise.all([
            this.prisma.coupon.count(),
            this.prisma.coupon.count({ where: { status: client_1.CouponStatus.ACTIVE } }),
            this.prisma.coupon.count({ where: { status: client_1.CouponStatus.USED } }),
            this.prisma.coupon.count({ where: { status: client_1.CouponStatus.EXPIRED } }),
            this.prisma.coupon.count({ where: { status: client_1.CouponStatus.CANCELLED } }),
            this.prisma.redemption.count(),
        ]);
        const redemptionRate = totalCoupons > 0 ? (usedCoupons / totalCoupons) * 100 : 0;
        return {
            totalCoupons,
            activeCoupons,
            usedCoupons,
            expiredCoupons,
            cancelledCoupons,
            totalRedemptions,
            redemptionRate,
        };
    }
    async generateQRCodeData(couponId) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id: couponId },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                deal: {
                    select: {
                        title: true,
                        merchant: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        const qrData = {
            couponId: coupon.id,
            qrCode: coupon.qrCode,
            orderNumber: coupon.order.orderNumber,
            dealTitle: coupon.deal.title,
            merchantName: coupon.deal.merchant.name,
            customerName: `${coupon.order.customer.firstName || ''} ${coupon.order.customer.lastName || ''}`.trim(),
            expiresAt: coupon.expiresAt.toISOString(),
            status: coupon.status,
        };
        return await qrcode_1.default.toString(JSON.stringify(qrData), {
            type: 'utf8',
            errorCorrectionLevel: 'M',
        });
    }
    mapToCouponResponseDto(coupon) {
        return {
            id: coupon.id,
            orderId: coupon.orderId,
            dealId: coupon.dealId,
            qrCode: coupon.qrCode,
            status: coupon.status,
            usedAt: coupon.usedAt,
            expiresAt: coupon.expiresAt,
            createdAt: coupon.createdAt,
            updatedAt: coupon.updatedAt,
            order: coupon.order,
            deal: coupon.deal,
        };
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = CouponsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map