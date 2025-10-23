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
    async processRedemption(qrToken, staffId, notes, location) {
        try {
            const qrValidation = await this.qrSecurityService.validateQRCode(qrToken, staffId);
            if (!qrValidation.isValid) {
                throw new common_1.BadRequestException(qrValidation.error || 'Invalid QR code');
            }
            const staff = await this.prisma.staff.findUnique({
                where: { id: staffId },
                include: {
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!staff) {
                throw new common_1.NotFoundException('Staff member not found');
            }
            if (!staff.isActive) {
                throw new common_1.ForbiddenException('Staff member is not active');
            }
            if (staff.merchantId && staff.merchantId !== qrValidation.merchant.id) {
                throw new common_1.ForbiddenException('Staff can only redeem coupons for their assigned merchant');
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
                    staffId: staffId,
                    notes: notes || null,
                    location: location || null,
                    status: client_1.RedemptionStatus.COMPLETED,
                    redeemedAt: new Date(),
                    metadata: {
                        qrToken: qrToken.substring(0, 20) + '...',
                        validationTimestamp: new Date(),
                        staffRole: staff.role,
                        merchantId: staff.merchantId,
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
                    staff: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });
            await this.qrSecurityService.markQRCodeAsUsed(qrValidation.payload.couponId, staffId, notes);
            await this.prisma.coupon.update({
                where: { id: qrValidation.payload.couponId },
                data: {
                    status: 'USED',
                    usedAt: new Date(),
                },
            });
            this.logger.log(`Redemption processed: ${redemption.id} by staff ${staffId}`);
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
                    staff: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
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
    async findAll(page = 1, limit = 10, merchantId, staffId, status, startDate, endDate) {
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
            if (staffId) {
                where.staffId = staffId;
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
                        staff: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: {
                        redeemedAt: 'desc',
                    },
                }),
                this.prisma.redemption.count({ where }),
            ]);
            const redemptionsResponse = redemptions.map(r => this.mapToResponseDto(r));
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
                    staff: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
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
                this.prisma.redemption.count({ where: { ...where, status: client_1.RedemptionStatus.COMPLETED } }),
                this.prisma.redemption.count({ where: { ...where, status: client_1.RedemptionStatus.PENDING } }),
                this.prisma.redemption.count({ where: { ...where, status: client_1.RedemptionStatus.CANCELLED } }),
                this.prisma.redemption.groupBy({
                    by: ['staffId'],
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
            const staffIds = redemptionsByStaff.map(r => r.staffId).filter((id) => id !== null);
            const staffMembers = await this.prisma.staff.findMany({
                where: { id: { in: staffIds } },
                select: { id: true, firstName: true, lastName: true, role: true },
            });
            const staffMap = staffMembers.reduce((acc, staff) => {
                acc[staff.id] = `${staff.firstName} ${staff.lastName} (${staff.role})`;
                return acc;
            }, {});
            return {
                totalRedemptions,
                completedRedemptions,
                pendingRedemptions,
                cancelledRedemptions,
                completionRate: totalRedemptions > 0 ? (completedRedemptions / totalRedemptions) * 100 : 0,
                redemptionsByStaff: redemptionsByStaff.map(stat => ({
                    staffId: stat.staffId,
                    staffName: staffMap[stat.staffId] || 'Unknown Staff',
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
                    averageDailyRedemptions: dailyRedemptions.length > 0 ? dailyRedemptions.reduce((sum, day) => sum + day.count, 0) / dailyRedemptions.length : 0,
                    peakHour: hourlyRedemptions.length > 0 ? hourlyRedemptions.reduce((max, hour) => hour.count > max.count ? hour : max) : null,
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
            const staff = await this.prisma.staff.findUnique({
                where: { id: staffId },
            });
            if (!staff || !staff.isActive) {
                return {
                    isValid: false,
                    error: 'Staff member not found or inactive',
                    canRedeem: false,
                };
            }
            const canRedeem = !staff.merchantId || staff.merchantId === qrValidation.merchant.id;
            return {
                isValid: true,
                canRedeem,
                coupon: qrValidation.coupon,
                order: qrValidation.order,
                deal: qrValidation.deal,
                customer: qrValidation.customer,
                merchant: qrValidation.merchant,
                staff: staff,
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
        const staffStats = await this.prisma.redemption.groupBy({
            by: ['staffId'],
            _count: { id: true },
            where,
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 10,
        });
        const staffIds = staffStats.map(s => s.staffId).filter((id) => id !== null);
        const staffMembers = await this.prisma.staff.findMany({
            where: { id: { in: staffIds } },
            select: { id: true, firstName: true, lastName: true, role: true },
        });
        const staffMap = staffMembers.reduce((acc, staff) => {
            acc[staff.id] = `${staff.firstName} ${staff.lastName}`;
            return acc;
        }, {});
        return staffStats.map(stat => ({
            staffId: stat.staffId,
            staffName: staffMap[stat.staffId] || 'Unknown Staff',
            redemptionCount: stat._count.id,
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
        return redemptions.map(redemption => ({
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
        const couponIds = customerStats.map(c => c.couponId);
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
            staffId: redemption.staffId,
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
            staff: {
                id: redemption.staff.id,
                firstName: redemption.staff.firstName,
                lastName: redemption.staff.lastName,
                email: redemption.staff.email,
                role: redemption.staff.role,
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