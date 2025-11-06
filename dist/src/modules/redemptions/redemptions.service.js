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
var RedemptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedemptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const qr_security_service_1 = require("../qr-security/qr-security.service");
const client_1 = require("@prisma/client");
let RedemptionService = RedemptionService_1 = class RedemptionService {
    prisma;
    qrSecurityService;
    logger = new common_1.Logger(RedemptionService_1.name);
    constructor(prisma, qrSecurityService) {
        this.prisma = prisma;
        this.qrSecurityService = qrSecurityService;
    }
    async processRedemption(qrToken, redeemedByUserId, notes, location) {
        try {
            const qrValidation = await this.qrSecurityService.validateQRCode(qrToken, redeemedByUserId);
            if (!qrValidation.isValid) {
                throw new common_1.BadRequestException(qrValidation.error || 'Invalid QR code');
            }
            const existingRedemption = await this.prisma.redemption.findFirst({
                where: { couponId: qrValidation.payload.couponId },
            });
            if (existingRedemption) {
                throw new common_1.BadRequestException('Coupon has already been redeemed');
            }
            const redemption = await this.prisma.redemption.create({
                data: {
                    couponId: qrValidation.payload.couponId,
                    redeemedByUserId: redeemedByUserId,
                    notes: notes || null,
                    location: location || null,
                    status: client_1.RedemptionStatus.COMPLETED,
                    redeemedAt: new Date(),
                    metadata: {
                        qrToken: qrToken.substring(0, 20) + '...',
                        validationTimestamp: new Date(),
                        redeemedByUserId,
                    },
                },
                include: {
                    coupon: {
                        include: {
                            order: {
                                include: {
                                    customer: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                    deal: {
                                        include: {
                                            merchant: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    email: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            await this.qrSecurityService.markQRCodeAsUsed(qrValidation.payload.couponId, redeemedByUserId, notes);
            await this.prisma.coupon.update({
                where: { id: qrValidation.payload.couponId },
                data: {
                    status: 'USED',
                    usedAt: new Date(),
                },
            });
            this.logger.log(`Redemption processed: ${redemption.id} by user ${redeemedByUserId}`);
            return this.mapToResponseDto(redemption);
        }
        catch (error) {
            this.logger.error('Failed to process redemption:', error);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const redemption = await this.prisma.redemption.findUnique({
                where: { id },
                include: {
                    coupon: {
                        include: {
                            order: {
                                include: {
                                    customer: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                    deal: {
                                        include: {
                                            merchant: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    email: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!redemption) {
                throw new common_1.NotFoundException('Redemption not found');
            }
            return this.mapToResponseDto(redemption);
        }
        catch (error) {
            this.logger.error(`Failed to find redemption ${id}:`, error);
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, merchantId, redeemedByUserId, status, startDate, endDate) {
        try {
            const skip = (page - 1) * limit;
            const where = {};
            if (merchantId) {
                where.coupon = {
                    order: {
                        deal: {
                            merchantId: merchantId,
                        },
                    },
                };
            }
            if (redeemedByUserId) {
                where.redeemedByUserId = redeemedByUserId;
            }
            if (status) {
                where.status = status;
            }
            if (startDate || endDate) {
                where.redeemedAt = {};
                if (startDate)
                    where.redeemedAt.gte = startDate;
                if (endDate)
                    where.redeemedAt.lte = endDate;
            }
            const [redemptions, total] = await Promise.all([
                this.prisma.redemption.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        coupon: {
                            include: {
                                order: {
                                    include: {
                                        customer: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                email: true,
                                            },
                                        },
                                        deal: {
                                            include: {
                                                merchant: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        redeemedAt: 'desc',
                    },
                }),
                this.prisma.redemption.count({ where }),
            ]);
            const redemptionsResponse = redemptions.map((r) => this.mapToResponseDto(r));
            return {
                redemptions: redemptionsResponse,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to find redemptions:', error);
            throw error;
        }
    }
    async updateStatus(id, status, notes) {
        try {
            const redemption = await this.prisma.redemption.findUnique({
                where: { id },
            });
            if (!redemption) {
                throw new common_1.NotFoundException('Redemption not found');
            }
            const updatedRedemption = await this.prisma.redemption.update({
                where: { id },
                data: {
                    status,
                    notes: notes || redemption.notes,
                    updatedAt: new Date(),
                },
                include: {
                    coupon: {
                        include: {
                            order: {
                                include: {
                                    customer: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                    deal: {
                                        include: {
                                            merchant: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    email: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            this.logger.log(`Redemption status updated: ${id} to ${status}`);
            return this.mapToResponseDto(updatedRedemption);
        }
        catch (error) {
            this.logger.error(`Failed to update redemption status ${id}:`, error);
            throw error;
        }
    }
    async getRedemptionStats(merchantId) {
        try {
            const where = {};
            if (merchantId) {
                where.coupon = {
                    order: {
                        deal: {
                            merchantId: merchantId,
                        },
                    },
                };
            }
            const [totalRedemptions, completedRedemptions, pendingRedemptions, cancelledRedemptions, redemptionsByStaff, redemptionsByMerchant, recentRedemptions,] = await Promise.all([
                this.prisma.redemption.count({ where }),
                this.prisma.redemption.count({
                    where: { ...where, status: client_1.RedemptionStatus.COMPLETED },
                }),
                this.prisma.redemption.count({
                    where: { ...where, status: client_1.RedemptionStatus.PENDING },
                }),
                this.prisma.redemption.count({
                    where: { ...where, status: client_1.RedemptionStatus.CANCELLED },
                }),
                this.prisma.redemption.groupBy({
                    by: ['redeemedByUserId'],
                    _count: { id: true },
                    where,
                }),
                this.prisma.redemption.groupBy({
                    by: ['couponId'],
                    _count: { id: true },
                    where,
                }),
                this.prisma.redemption.count({
                    where: {
                        ...where,
                        redeemedAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                        },
                    },
                }),
            ]);
            const userIds = redemptionsByStaff
                .map((r) => r.redeemedByUserId)
                .filter((id) => id !== null);
            const users = await this.prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, email: true },
            });
            const userMap = users.reduce((acc, u) => {
                acc[u.id] = u.email;
                return acc;
            }, {});
            return {
                totalRedemptions,
                completedRedemptions,
                pendingRedemptions,
                cancelledRedemptions,
                completionRate: totalRedemptions > 0
                    ? (completedRedemptions / totalRedemptions) * 100
                    : 0,
                redemptionsByStaff: redemptionsByStaff.map((stat) => ({
                    userId: stat.redeemedByUserId,
                    userEmail: userMap[stat.redeemedByUserId] || 'Unknown User',
                    redemptionCount: stat._count.id,
                })),
                recentRedemptions,
                averageRedemptionTime: undefined,
                statusDistribution: {
                    completed: completedRedemptions,
                    pending: pendingRedemptions,
                    cancelled: cancelledRedemptions,
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to get redemption stats:', error);
            throw error;
        }
    }
    async getRedemptionAnalytics(merchantId, startDate, endDate) {
        try {
            const where = {};
            if (merchantId) {
                where.coupon = {
                    order: {
                        deal: {
                            merchantId: merchantId,
                        },
                    },
                };
            }
            if (startDate || endDate) {
                where.redeemedAt = {};
                if (startDate)
                    where.redeemedAt.gte = startDate;
                if (endDate)
                    where.redeemedAt.lte = endDate;
            }
            const [dailyRedemptions, hourlyRedemptions, topPerformingStaff, redemptionTrends, customerRedemptions,] = await Promise.all([
                this.getDailyRedemptions(where),
                this.getHourlyRedemptions(where),
                this.getTopPerformingStaff(where),
                this.getRedemptionTrends(where),
                this.getCustomerRedemptions(where),
            ]);
            return {
                dailyRedemptions,
                hourlyRedemptions,
                topPerformingStaff,
                redemptionTrends,
                customerRedemptions,
                summary: {
                    totalRedemptions: dailyRedemptions.reduce((sum, day) => sum + day.count, 0),
                    averageDailyRedemptions: dailyRedemptions.length > 0
                        ? dailyRedemptions.reduce((sum, day) => sum + day.count, 0) /
                            dailyRedemptions.length
                        : 0,
                    peakHour: hourlyRedemptions.length > 0
                        ? hourlyRedemptions.reduce((max, hour) => hour.count > max.count ? hour : max)
                        : null,
                    topStaff: topPerformingStaff.length > 0 ? topPerformingStaff[0] : null,
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to get redemption analytics:', error);
            throw error;
        }
    }
    async validateRedemption(qrToken, staffId) {
        try {
            const qrValidation = await this.qrSecurityService.validateQRCode(qrToken, staffId);
            if (!qrValidation.isValid) {
                return {
                    isValid: false,
                    error: qrValidation.error || 'Invalid QR code',
                    canRedeem: false,
                };
            }
            const canRedeem = true;
            return {
                isValid: true,
                canRedeem,
                coupon: qrValidation.coupon,
                order: qrValidation.order,
                deal: qrValidation.deal,
                customer: qrValidation.customer,
                merchant: qrValidation.merchant,
                validationTimestamp: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Failed to validate redemption:', error);
            return {
                isValid: false,
                error: 'Validation failed',
                canRedeem: false,
            };
        }
    }
    async getDailyRedemptions(where) {
        const redemptions = await this.prisma.redemption.findMany({
            where,
            select: {
                redeemedAt: true,
            },
        });
        const dailyStats = redemptions.reduce((acc, redemption) => {
            const date = redemption.redeemedAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(dailyStats).map(([date, count]) => ({
            date,
            count,
        }));
    }
    async getHourlyRedemptions(where) {
        const redemptions = await this.prisma.redemption.findMany({
            where,
            select: {
                redeemedAt: true,
            },
        });
        const hourlyStats = redemptions.reduce((acc, redemption) => {
            const hour = redemption.redeemedAt.getHours();
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(hourlyStats).map(([hour, count]) => ({
            hour: parseInt(hour),
            count,
        }));
    }
    async getTopPerformingStaff(where) {
        const stats = await this.prisma.redemption.groupBy({
            by: ['redeemedByUserId'],
            _count: { id: true },
            where,
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 10,
        });
        const userIds = stats
            .map((s) => s.redeemedByUserId)
            .filter((id) => id !== null);
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, email: true },
        });
        const userMap = users.reduce((acc, u) => {
            acc[u.id] = u.email;
            return acc;
        }, {});
        return stats.map((stat) => ({
            userId: stat.redeemedByUserId,
            userEmail: userMap[stat.redeemedByUserId] || 'Unknown User',
            redemptionCount: stat._count?.id ?? 0,
        }));
    }
    async getRedemptionTrends(where) {
        const redemptions = await this.prisma.redemption.findMany({
            where,
            select: {
                redeemedAt: true,
            },
            orderBy: {
                redeemedAt: 'asc',
            },
        });
        return redemptions.map((redemption) => ({
            date: redemption.redeemedAt,
            status: 'COMPLETED',
        }));
    }
    async getCustomerRedemptions(where) {
        const customerStats = await this.prisma.redemption.groupBy({
            by: ['couponId'],
            _count: { id: true },
            where,
        });
        const couponIds = customerStats.map((c) => c.couponId);
        const coupons = await this.prisma.coupon.findMany({
            where: { id: { in: couponIds } },
            include: {
                order: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        const customerMap = coupons.reduce((acc, coupon) => {
            const customerId = coupon.order.customerId;
            if (!acc[customerId]) {
                acc[customerId] = {
                    customerId,
                    customerName: `${coupon.order.customer.firstName} ${coupon.order.customer.lastName}`,
                    redemptionCount: 0,
                };
            }
            acc[customerId].redemptionCount += 1;
            return acc;
        }, {});
        return Object.values(customerMap);
    }
    mapToResponseDto(redemption) {
        return {
            id: redemption.id,
            couponId: redemption.couponId,
            redeemedByUserId: redemption.redeemedByUserId,
            notes: redemption.notes,
            location: redemption.location,
            status: redemption.status,
            redeemedAt: redemption.redeemedAt,
            createdAt: redemption.createdAt,
            updatedAt: redemption.updatedAt,
            metadata: redemption.metadata,
            coupon: {
                id: redemption.coupon.id,
                orderId: redemption.coupon.orderId,
                dealId: redemption.coupon.dealId,
                status: redemption.coupon.status,
                expiresAt: redemption.coupon.expiresAt,
                usedAt: redemption.coupon.usedAt,
            },
            order: {
                id: redemption.coupon.order.id,
                orderNumber: redemption.coupon.order.orderNumber,
                customerId: redemption.coupon.order.customerId,
                totalAmount: Number(redemption.coupon.order.totalAmount),
                status: redemption.coupon.order.status,
            },
            deal: {
                id: redemption.coupon.order.deal.id,
                title: redemption.coupon.order.deal.title,
                description: redemption.coupon.order.deal.description,
                merchantId: redemption.coupon.order.deal.merchantId,
                discountPrice: Number(redemption.coupon.order.deal.discountPrice),
            },
            customer: {
                id: redemption.coupon.order.customer.id,
                firstName: redemption.coupon.order.customer.firstName,
                lastName: redemption.coupon.order.customer.lastName,
                email: redemption.coupon.order.customer.email,
            },
            merchant: {
                id: redemption.coupon.order.deal.merchant.id,
                name: redemption.coupon.order.deal.merchant.name,
                email: redemption.coupon.order.deal.merchant.email,
            },
        };
    }
};
exports.RedemptionService = RedemptionService;
exports.RedemptionService = RedemptionService = RedemptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        qr_security_service_1.QRCodeSecurityService])
], RedemptionService);
//# sourceMappingURL=redemptions.service.js.map