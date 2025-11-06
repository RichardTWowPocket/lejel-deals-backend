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
exports.MerchantRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let MerchantRoleGuard = class MerchantRoleGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('merchantRoles', [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }
        let merchantId = request.params?.merchantId ||
            request.query?.merchantId ||
            request.body?.merchantId;
        if (!merchantId) {
            const route = request.route?.path || '';
            if (route.includes('/me/')) {
                const membership = await this.prisma.merchantMembership.findFirst({
                    where: { userId: user.id },
                    orderBy: { createdAt: 'asc' },
                });
                if (membership) {
                    merchantId = membership.merchantId;
                }
            }
        }
        if (!merchantId && user.merchantIds && user.merchantIds.length > 0) {
            if (user.merchantIds.length === 1) {
                merchantId = user.merchantIds[0];
            }
            else {
                const membership = await this.prisma.merchantMembership.findFirst({
                    where: {
                        userId: user.id,
                        merchantId: { in: user.merchantIds },
                    },
                    include: {
                        merchant: {
                            select: {
                                id: true,
                                isActive: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                });
                if (membership && membership.merchant?.isActive) {
                    merchantId = membership.merchantId;
                }
            }
        }
        if (!merchantId) {
            const membership = await this.prisma.merchantMembership.findFirst({
                where: { userId: user.id },
                include: {
                    merchant: {
                        select: {
                            id: true,
                            isActive: true,
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
            });
            if (membership && membership.merchant?.isActive) {
                merchantId = membership.merchantId;
            }
        }
        if (!merchantId && request.params?.id) {
            const entityId = request.params.id;
            const route = request.route?.path || '';
            if (route.includes('/deals/')) {
                const deal = await this.prisma.deal.findUnique({
                    where: { id: entityId },
                    select: { merchantId: true },
                });
                if (deal)
                    merchantId = deal.merchantId;
            }
            else if (route.includes('/orders/')) {
                const order = await this.prisma.order.findUnique({
                    where: { id: entityId },
                    include: {
                        deal: {
                            select: {
                                merchantId: true,
                            },
                        },
                    },
                });
                if (order?.deal) {
                    merchantId = order.deal.merchantId;
                }
            }
            else if (route.includes('/redemptions/')) {
                const redemption = await this.prisma.redemption.findUnique({
                    where: { id: entityId },
                    include: {
                        coupon: {
                            include: {
                                deal: {
                                    select: {
                                        merchantId: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (redemption?.coupon?.deal) {
                    merchantId = redemption.coupon.deal.merchantId;
                }
            }
            else if (route.includes('/staff/')) {
                const membership = await this.prisma.merchantMembership.findFirst({
                    where: { userId: entityId },
                    select: { merchantId: true },
                });
                if (membership) {
                    merchantId = membership.merchantId;
                }
            }
        }
        if (!merchantId) {
            throw new common_1.ForbiddenException('Merchant ID is required to check merchant role access');
        }
        const membership = await this.prisma.merchantMembership.findFirst({
            where: {
                userId: user.id,
                merchantId: merchantId,
            },
            include: {
                merchant: {
                    select: {
                        id: true,
                        isActive: true,
                    },
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You do not have access to this merchant');
        }
        if (!membership.merchant?.isActive) {
            throw new common_1.ForbiddenException('Merchant is not active');
        }
        const userMerchantRole = membership.merchantRole;
        const hasAccess = requiredRoles.some((requiredRole) => this.hasRoleAccess(userMerchantRole, requiredRole));
        if (!hasAccess) {
            throw new common_1.ForbiddenException(`Required merchant role: ${requiredRoles.join(' or ')}. Your role: ${userMerchantRole}`);
        }
        request.merchantMembership = membership;
        return true;
    }
    hasRoleAccess(userRole, requiredRole) {
        const roleHierarchy = {
            [client_1.MerchantRole.OWNER]: 5,
            [client_1.MerchantRole.ADMIN]: 4,
            [client_1.MerchantRole.MANAGER]: 3,
            [client_1.MerchantRole.SUPERVISOR]: 2,
            [client_1.MerchantRole.CASHIER]: 1,
        };
        return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    }
};
exports.MerchantRoleGuard = MerchantRoleGuard;
exports.MerchantRoleGuard = MerchantRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], MerchantRoleGuard);
//# sourceMappingURL=merchant-role.guard.js.map