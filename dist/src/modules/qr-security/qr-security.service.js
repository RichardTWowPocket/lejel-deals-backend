"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var QRCodeSecurityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeSecurityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
let QRCodeSecurityService = QRCodeSecurityService_1 = class QRCodeSecurityService {
    prisma;
    logger = new common_1.Logger(QRCodeSecurityService_1.name);
    qrSecret = process.env.QR_CODE_SECRET || 'qr-secret-key-change-in-production';
    qrExpirationHours = 24;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateSecureQRCode(couponId) {
        try {
            const coupon = await this.prisma.coupon.findUnique({
                where: { id: couponId },
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
            });
            if (!coupon) {
                throw new common_1.BadRequestException('Coupon not found');
            }
            if (coupon.status !== 'ACTIVE') {
                throw new common_1.BadRequestException('Coupon is not active');
            }
            if (coupon.usedAt) {
                throw new common_1.BadRequestException('Coupon has already been used');
            }
            if (new Date() > coupon.expiresAt) {
                throw new common_1.BadRequestException('Coupon has expired');
            }
            const nonce = crypto.randomBytes(16).toString('hex');
            const payload = {
                couponId: coupon.id,
                orderId: coupon.orderId,
                dealId: coupon.dealId,
                customerId: coupon.order.customerId,
                merchantId: coupon.order.deal.merchantId,
                expiresAt: coupon.expiresAt,
                issuedAt: new Date(),
                nonce,
            };
            const qrToken = jwt.sign(payload, this.qrSecret, {
                expiresIn: `${this.qrExpirationHours}h`,
                issuer: 'lejel-deals',
                audience: 'coupon-redemption',
            });
            await this.logQRActivity('GENERATED', couponId, {
                orderId: coupon.orderId,
                dealId: coupon.dealId,
                customerId: coupon.order.customerId,
                merchantId: coupon.order.deal.merchantId,
                nonce,
            });
            this.logger.log(`Secure QR code generated for coupon ${couponId}`);
            return qrToken;
        }
        catch (error) {
            this.logger.error(`Failed to generate QR code for coupon ${couponId}:`, error);
            throw error;
        }
    }
    async validateQRCode(qrToken, staffId) {
        try {
            let payload;
            try {
                payload = jwt.verify(qrToken, this.qrSecret, {
                    issuer: 'lejel-deals',
                    audience: 'coupon-redemption',
                });
            }
            catch (jwtError) {
                await this.logQRActivity('INVALID_SIGNATURE', null, { error: jwtError.message });
                return {
                    isValid: false,
                    error: 'Invalid QR code signature',
                };
            }
            if (new Date() > payload.expiresAt) {
                await this.logQRActivity('EXPIRED', payload.couponId, { expiresAt: payload.expiresAt });
                return {
                    isValid: false,
                    error: 'QR code has expired',
                };
            }
            const coupon = await this.prisma.coupon.findUnique({
                where: { id: payload.couponId },
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
            });
            if (!coupon) {
                await this.logQRActivity('COUPON_NOT_FOUND', payload.couponId);
                return {
                    isValid: false,
                    error: 'Coupon not found',
                };
            }
            if (coupon.status !== 'ACTIVE') {
                await this.logQRActivity('INVALID_STATUS', payload.couponId, { status: coupon.status });
                return {
                    isValid: false,
                    error: `Coupon is ${coupon.status.toLowerCase()}`,
                };
            }
            if (coupon.usedAt) {
                await this.logQRActivity('ALREADY_USED', payload.couponId, { usedAt: coupon.usedAt });
                return {
                    isValid: false,
                    error: 'Coupon has already been used',
                };
            }
            if (payload.nonce !== coupon.qrCode) {
                await this.logQRActivity('INVALID_NONCE', payload.couponId, {
                    expected: coupon.qrCode,
                    received: payload.nonce
                });
                return {
                    isValid: false,
                    error: 'Invalid QR code nonce',
                };
            }
            await this.logQRActivity('VALIDATED', payload.couponId, {
                staffId,
                orderId: payload.orderId,
                dealId: payload.dealId,
            });
            return {
                isValid: true,
                payload,
                coupon,
                order: coupon.order,
                deal: coupon.order.deal,
                customer: coupon.order.customer,
                merchant: coupon.order.deal.merchant,
            };
        }
        catch (error) {
            this.logger.error('QR code validation failed:', error);
            return {
                isValid: false,
                error: 'QR code validation failed',
            };
        }
    }
    async markQRCodeAsUsed(couponId, staffId, notes) {
        try {
            await this.prisma.coupon.update({
                where: { id: couponId },
                data: {
                    status: 'USED',
                    usedAt: new Date(),
                },
            });
            await this.prisma.redemption.create({
                data: {
                    couponId,
                    staffId,
                    notes,
                    redeemedAt: new Date(),
                },
            });
            await this.logQRActivity('REDEEMED', couponId, {
                staffId,
                notes,
                redeemedAt: new Date(),
            });
            this.logger.log(`QR code redeemed for coupon ${couponId} by staff ${staffId}`);
        }
        catch (error) {
            this.logger.error(`Failed to mark QR code as used for coupon ${couponId}:`, error);
            throw error;
        }
    }
    async revokeQRCode(couponId, reason) {
        try {
            await this.prisma.coupon.update({
                where: { id: couponId },
                data: {
                    status: 'CANCELLED',
                },
            });
            await this.logQRActivity('REVOKED', couponId, {
                reason,
                revokedAt: new Date(),
            });
            this.logger.log(`QR code revoked for coupon ${couponId}: ${reason}`);
        }
        catch (error) {
            this.logger.error(`Failed to revoke QR code for coupon ${couponId}:`, error);
            throw error;
        }
    }
    async getQRCodeHistory(couponId) {
        try {
            const activities = await this.prisma.qRCodeActivity.findMany({
                where: { couponId },
                orderBy: { createdAt: 'desc' },
            });
            return activities;
        }
        catch (error) {
            this.logger.error(`Failed to get QR code history for coupon ${couponId}:`, error);
            throw error;
        }
    }
    async getQRCodeStats() {
        try {
            const [totalGenerated, totalValidated, totalRedeemed, totalExpired, totalRevoked, recentActivity,] = await Promise.all([
                this.prisma.qRCodeActivity.count({ where: { action: 'GENERATED' } }),
                this.prisma.qRCodeActivity.count({ where: { action: 'VALIDATED' } }),
                this.prisma.qRCodeActivity.count({ where: { action: 'REDEEMED' } }),
                this.prisma.qRCodeActivity.count({ where: { action: 'EXPIRED' } }),
                this.prisma.qRCodeActivity.count({ where: { action: 'REVOKED' } }),
                this.prisma.qRCodeActivity.count({
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                        },
                    },
                }),
            ]);
            return {
                totalGenerated,
                totalValidated,
                totalRedeemed,
                totalExpired,
                totalRevoked,
                recentActivity,
                successRate: totalGenerated > 0 ? (totalRedeemed / totalGenerated) * 100 : 0,
                expirationRate: totalGenerated > 0 ? (totalExpired / totalGenerated) * 100 : 0,
            };
        }
        catch (error) {
            this.logger.error('Failed to get QR code stats:', error);
            throw error;
        }
    }
    async logQRActivity(action, couponId, metadata) {
        try {
            await this.prisma.qRCodeActivity.create({
                data: {
                    action,
                    couponId,
                    metadata: metadata || {},
                    timestamp: new Date(),
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log QR code activity:', error);
        }
    }
    async cleanupExpiredQRCodes() {
        try {
            const expiredCoupons = await this.prisma.coupon.findMany({
                where: {
                    status: 'ACTIVE',
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });
            let cleanedCount = 0;
            for (const coupon of expiredCoupons) {
                await this.prisma.coupon.update({
                    where: { id: coupon.id },
                    data: { status: 'EXPIRED' },
                });
                await this.logQRActivity('AUTO_EXPIRED', coupon.id, {
                    expiresAt: coupon.expiresAt,
                    cleanedAt: new Date(),
                });
                cleanedCount++;
            }
            this.logger.log(`Cleaned up ${cleanedCount} expired QR codes`);
            return cleanedCount;
        }
        catch (error) {
            this.logger.error('Failed to cleanup expired QR codes:', error);
            throw error;
        }
    }
};
exports.QRCodeSecurityService = QRCodeSecurityService;
exports.QRCodeSecurityService = QRCodeSecurityService = QRCodeSecurityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QRCodeSecurityService);
//# sourceMappingURL=qr-security.service.js.map