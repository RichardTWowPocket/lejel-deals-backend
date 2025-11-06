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
var StaffService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const staff_dto_1 = require("./dto/staff.dto");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
let StaffService = StaffService_1 = class StaffService {
    prisma;
    logger = new common_1.Logger(StaffService_1.name);
    jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    jwtExpiresIn = '8h';
    roleHierarchy = {
        [client_1.MerchantRole.OWNER]: 5,
        [client_1.MerchantRole.ADMIN]: 4,
        [client_1.MerchantRole.MANAGER]: 3,
        [client_1.MerchantRole.SUPERVISOR]: 2,
        [client_1.MerchantRole.CASHIER]: 1,
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    canAccessStaffRole(currentUserRole, targetStaffRole) {
        if (!currentUserRole) {
            return false;
        }
        if (currentUserRole === client_1.MerchantRole.OWNER || currentUserRole === client_1.MerchantRole.ADMIN) {
            return true;
        }
        if (currentUserRole === client_1.MerchantRole.MANAGER) {
            return (targetStaffRole === client_1.MerchantRole.SUPERVISOR ||
                targetStaffRole === client_1.MerchantRole.CASHIER);
        }
        return false;
    }
    async create(createStaffDto) {
        try {
            const merchantId = createStaffDto.merchantId;
            if (!merchantId) {
                throw new common_1.BadRequestException('Merchant ID is required');
            }
            const existingUser = await this.prisma.user.findUnique({
                where: { email: createStaffDto.email },
                include: {
                    merchants: {
                        where: { merchantId },
                    },
                },
            });
            if (existingUser) {
                const existingMembership = existingUser.merchants.find(m => m.merchantId === merchantId);
                if (existingMembership) {
                    throw new common_1.ConflictException('Staff with this email already exists for this merchant');
                }
            }
            const hashedPin = await bcrypt.hash(createStaffDto.pin, 10);
            const metadata = {
                pin: hashedPin,
                firstName: createStaffDto.firstName,
                lastName: createStaffDto.lastName,
                phone: createStaffDto.phone,
                lastLoginAt: null,
            };
            const merchantRole = createStaffDto.role
                ? (0, staff_dto_1.mapStaffRoleToMerchantRole)(createStaffDto.role)
                : client_1.MerchantRole.CASHIER;
            let user;
            if (existingUser) {
                user = existingUser;
            }
            else {
                user = await this.prisma.user.create({
                    data: {
                        email: createStaffDto.email,
                        role: 'MERCHANT',
                        isActive: true,
                    },
                });
            }
            const membership = await this.prisma.merchantMembership.create({
                data: {
                    userId: user.id,
                    merchantId,
                    merchantRole,
                    permissions: createStaffDto.permissions,
                    metadata,
                },
                include: {
                    user: true,
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            this.logger.log(`Staff created: ${createStaffDto.email} (${merchantRole})`);
            return this.mapToResponseDto(membership, user);
        }
        catch (error) {
            this.logger.error('Failed to create staff:', error);
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, merchantId, role, isActive, currentUserRole) {
        try {
            const skip = (page - 1) * limit;
            const where = {};
            if (merchantId) {
                where.merchantId = merchantId;
            }
            if (currentUserRole === client_1.MerchantRole.MANAGER) {
                if (role) {
                    const merchantRole = (0, staff_dto_1.mapStaffRoleToMerchantRole)(role);
                    if (merchantRole !== client_1.MerchantRole.SUPERVISOR && merchantRole !== client_1.MerchantRole.CASHIER) {
                        return {
                            staff: [],
                            pagination: {
                                page,
                                limit,
                                total: 0,
                                totalPages: 0,
                            },
                        };
                    }
                    where.merchantRole = merchantRole;
                }
                else {
                    where.merchantRole = {
                        in: [client_1.MerchantRole.SUPERVISOR, client_1.MerchantRole.CASHIER],
                    };
                }
            }
            else if (role) {
                const merchantRole = (0, staff_dto_1.mapStaffRoleToMerchantRole)(role);
                where.merchantRole = merchantRole;
            }
            const [memberships, total] = await Promise.all([
                this.prisma.merchantMembership.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        user: true,
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                this.prisma.merchantMembership.count({ where }),
            ]);
            let filteredMemberships = memberships;
            if (isActive !== undefined) {
                filteredMemberships = memberships.filter(m => m.user.isActive === isActive);
            }
            if (currentUserRole) {
                filteredMemberships = filteredMemberships.filter(m => this.canAccessStaffRole(currentUserRole, m.merchantRole));
            }
            const staffResponse = filteredMemberships.map(m => this.mapToResponseDto(m, m.user));
            return {
                staff: staffResponse,
                pagination: {
                    page,
                    limit,
                    total: filteredMemberships.length,
                    totalPages: Math.ceil(filteredMemberships.length / limit),
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to find staff:', error);
            throw error;
        }
    }
    async findOne(id, currentUserRole) {
        try {
            const membership = await this.prisma.merchantMembership.findUnique({
                where: { id },
                include: {
                    user: true,
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!membership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
                throw new common_1.UnauthorizedException('You do not have permission to view this staff member');
            }
            return this.mapToResponseDto(membership, membership.user);
        }
        catch (error) {
            this.logger.error(`Failed to find staff ${id}:`, error);
            throw error;
        }
    }
    async findByEmail(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: {
                    merchants: {
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
            });
            if (!user || user.merchants.length === 0) {
                throw new common_1.NotFoundException('Staff not found');
            }
            const membership = user.merchants[0];
            return this.mapToResponseDto(membership, user);
        }
        catch (error) {
            this.logger.error(`Failed to find staff by email ${email}:`, error);
            throw error;
        }
    }
    async update(id, updateStaffDto, currentUserRole) {
        try {
            const membership = await this.prisma.merchantMembership.findUnique({
                where: { id },
                include: { user: true },
            });
            if (!membership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
                throw new common_1.UnauthorizedException('You do not have permission to update this staff member');
            }
            if (updateStaffDto.role && currentUserRole) {
                const newMerchantRole = (0, staff_dto_1.mapStaffRoleToMerchantRole)(updateStaffDto.role);
                if (!this.canAccessStaffRole(currentUserRole, newMerchantRole)) {
                    throw new common_1.UnauthorizedException('You do not have permission to assign this role');
                }
            }
            if (updateStaffDto.email && updateStaffDto.email !== membership.user.email) {
                const emailExists = await this.prisma.user.findUnique({
                    where: { email: updateStaffDto.email },
                });
                if (emailExists) {
                    throw new common_1.ConflictException('User with this email already exists');
                }
            }
            const userUpdateData = {};
            if (updateStaffDto.email) {
                userUpdateData.email = updateStaffDto.email;
            }
            if (updateStaffDto.isActive !== undefined) {
                userUpdateData.isActive = updateStaffDto.isActive;
            }
            if (Object.keys(userUpdateData).length > 0) {
                await this.prisma.user.update({
                    where: { id: membership.userId },
                    data: userUpdateData,
                });
            }
            const currentMetadata = membership.metadata || {};
            const updatedMetadata = {
                ...currentMetadata,
                firstName: updateStaffDto.firstName ?? currentMetadata.firstName,
                lastName: updateStaffDto.lastName ?? currentMetadata.lastName,
                phone: updateStaffDto.phone ?? currentMetadata.phone,
            };
            if (updateStaffDto.pin) {
                updatedMetadata.pin = await bcrypt.hash(updateStaffDto.pin, 10);
            }
            const membershipUpdateData = {
                metadata: updatedMetadata,
            };
            if (updateStaffDto.role) {
                membershipUpdateData.merchantRole = (0, staff_dto_1.mapStaffRoleToMerchantRole)(updateStaffDto.role);
            }
            if (updateStaffDto.permissions !== undefined) {
                membershipUpdateData.permissions = updateStaffDto.permissions;
            }
            const updatedMembership = await this.prisma.merchantMembership.update({
                where: { id },
                data: membershipUpdateData,
                include: {
                    user: true,
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            this.logger.log(`Staff updated: ${updatedMembership.user.email}`);
            return this.mapToResponseDto(updatedMembership, updatedMembership.user);
        }
        catch (error) {
            this.logger.error(`Failed to update staff ${id}:`, error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const membership = await this.prisma.merchantMembership.findUnique({
                where: { id },
                include: { user: true },
            });
            if (!membership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            await this.prisma.merchantMembership.delete({
                where: { id },
            });
            this.logger.log(`Staff deleted: ${membership.user.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete staff ${id}:`, error);
            throw error;
        }
    }
    async login(loginDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.identifier },
                include: {
                    merchants: {
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
            });
            if (!user || !user.isActive || user.merchants.length === 0) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            let validMembership = null;
            for (const membership of user.merchants) {
                const metadata = membership.metadata || {};
                const hashedPin = metadata.pin;
                if (hashedPin) {
                    const isPinValid = await bcrypt.compare(loginDto.pin, hashedPin);
                    if (isPinValid) {
                        validMembership = membership;
                        break;
                    }
                }
            }
            if (!validMembership) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const metadata = validMembership.metadata || {};
            metadata.lastLoginAt = new Date().toISOString();
            await this.prisma.merchantMembership.update({
                where: { id: validMembership.id },
                data: { metadata },
            });
            const payload = {
                sub: validMembership.id,
                email: user.email,
                role: (0, staff_dto_1.mapMerchantRoleToStaffRole)(validMembership.merchantRole),
                merchantId: validMembership.merchantId,
                type: 'staff',
            };
            const accessToken = jwt.sign(payload, this.jwtSecret, {
                expiresIn: this.jwtExpiresIn,
            });
            this.logger.log(`Staff logged in: ${user.email}`);
            return {
                staff: this.mapToResponseDto(validMembership, user),
                accessToken,
                expiresIn: 8 * 60 * 60,
            };
        }
        catch (error) {
            this.logger.error('Staff login failed:', error);
            throw error;
        }
    }
    async changePin(id, changePinDto, currentUserRole) {
        try {
            const membership = await this.prisma.merchantMembership.findUnique({
                where: { id },
            });
            if (!membership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
                throw new common_1.UnauthorizedException('You do not have permission to change PIN for this staff member');
            }
            const metadata = membership.metadata || {};
            const currentPin = metadata.pin;
            if (!currentPin) {
                throw new common_1.BadRequestException('No PIN set for this staff member');
            }
            const isCurrentPinValid = await bcrypt.compare(changePinDto.currentPin, currentPin);
            if (!isCurrentPinValid) {
                throw new common_1.BadRequestException('Current PIN is incorrect');
            }
            const hashedNewPin = await bcrypt.hash(changePinDto.newPin, 10);
            metadata.pin = hashedNewPin;
            await this.prisma.merchantMembership.update({
                where: { id },
                data: { metadata },
            });
            this.logger.log(`Staff PIN changed: ${id}`);
        }
        catch (error) {
            this.logger.error(`Failed to change PIN for staff ${id}:`, error);
            throw error;
        }
    }
    async deactivate(id, currentUserRole) {
        try {
            const membership = await this.prisma.merchantMembership.findUnique({
                where: { id },
                include: {
                    user: true,
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!membership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
                throw new common_1.UnauthorizedException('You do not have permission to deactivate this staff member');
            }
            await this.prisma.user.update({
                where: { id: membership.userId },
                data: { isActive: false },
            });
            const updatedMembership = await this.prisma.merchantMembership.findUnique({
                where: { id },
                include: {
                    user: true,
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!updatedMembership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            this.logger.log(`Staff deactivated: ${membership.user.email}`);
            return this.mapToResponseDto(updatedMembership, updatedMembership.user);
        }
        catch (error) {
            this.logger.error(`Failed to deactivate staff ${id}:`, error);
            throw error;
        }
    }
    async activate(id, currentUserRole) {
        try {
            const membership = await this.prisma.merchantMembership.findUnique({
                where: { id },
                include: {
                    user: true,
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!membership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            if (currentUserRole && !this.canAccessStaffRole(currentUserRole, membership.merchantRole)) {
                throw new common_1.UnauthorizedException('You do not have permission to activate this staff member');
            }
            await this.prisma.user.update({
                where: { id: membership.userId },
                data: { isActive: true },
            });
            const updatedMembership = await this.prisma.merchantMembership.findUnique({
                where: { id },
                include: {
                    user: true,
                    merchant: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!updatedMembership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            this.logger.log(`Staff activated: ${membership.user.email}`);
            return this.mapToResponseDto(updatedMembership, updatedMembership.user);
        }
        catch (error) {
            this.logger.error(`Failed to activate staff ${id}:`, error);
            throw error;
        }
    }
    async getStats() {
        try {
            const [totalMemberships, activeMemberships, membershipsByRole, membershipsByMerchant] = await Promise.all([
                this.prisma.merchantMembership.count(),
                this.prisma.merchantMembership.count({
                    where: {
                        user: {
                            isActive: true,
                        },
                    },
                }),
                this.prisma.merchantMembership.groupBy({
                    by: ['merchantRole'],
                    _count: { id: true },
                }),
                this.prisma.merchantMembership.groupBy({
                    by: ['merchantId'],
                    _count: { id: true },
                }),
            ]);
            const merchantIds = membershipsByMerchant.map(m => m.merchantId);
            const merchants = await this.prisma.merchant.findMany({
                where: { id: { in: merchantIds } },
                select: { id: true, name: true },
            });
            const merchantMap = merchants.reduce((acc, merchant) => {
                acc[merchant.id] = merchant.name;
                return acc;
            }, {});
            const roleStats = {
                MANAGER: 0,
                CASHIER: 0,
                SUPERVISOR: 0,
                ADMIN: 0,
            };
            membershipsByRole.forEach(role => {
                const staffRole = (0, staff_dto_1.mapMerchantRoleToStaffRole)(role.merchantRole);
                roleStats[staffRole] = (roleStats[staffRole] || 0) + role._count.id;
            });
            const allMemberships = await this.prisma.merchantMembership.findMany({
                include: { user: true },
            });
            const recentLogins = allMemberships.filter(m => {
                const metadata = m.metadata || {};
                const lastLogin = metadata.lastLoginAt;
                if (!lastLogin)
                    return false;
                const lastLoginDate = new Date(lastLogin);
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return lastLoginDate >= yesterday;
            }).length;
            const redemptionStats = await this.prisma.redemption.groupBy({
                by: ['redeemedByUserId'],
                _count: { id: true },
                where: {
                    redeemedByUserId: { not: null },
                },
            });
            const userIds = redemptionStats.map(r => r.redeemedByUserId).filter((id) => id !== null);
            const users = await this.prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, email: true },
            });
            const userMap = users.reduce((acc, user) => {
                acc[user.id] = user.email;
                return acc;
            }, {});
            const membershipIds = userIds.map(userId => {
                const membership = allMemberships.find(m => m.userId === userId);
                return membership?.id;
            }).filter((id) => id !== null);
            const staffNames = {};
            allMemberships.forEach(m => {
                if (userIds.includes(m.userId)) {
                    const metadata = m.metadata || {};
                    const firstName = metadata.firstName || '';
                    const lastName = metadata.lastName || '';
                    staffNames[m.userId] = `${firstName} ${lastName}`.trim() || userMap[m.userId] || 'Unknown Staff';
                }
            });
            const totalRedemptions = redemptionStats.reduce((sum, stat) => sum + stat._count.id, 0);
            const averageRedemptionsPerStaff = activeMemberships > 0 ? totalRedemptions / activeMemberships : 0;
            const mostActiveStaff = redemptionStats
                .filter(stat => stat.redeemedByUserId !== null)
                .map(stat => ({
                staffId: stat.redeemedByUserId,
                staffName: staffNames[stat.redeemedByUserId] || 'Unknown Staff',
                redemptions: stat._count.id,
            }))
                .sort((a, b) => b.redemptions - a.redemptions)
                .slice(0, 5);
            return {
                totalStaff: totalMemberships,
                activeStaff: activeMemberships,
                staffByRole: roleStats,
                staffByMerchant: membershipsByMerchant.map(stat => ({
                    merchantId: stat.merchantId,
                    merchantName: merchantMap[stat.merchantId] || 'Unknown Merchant',
                    staffCount: stat._count.id,
                })),
                recentLogins,
                activitySummary: {
                    totalRedemptions,
                    averageRedemptionsPerStaff,
                    mostActiveStaff,
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to get staff stats:', error);
            throw error;
        }
    }
    async getStaffActivity(staffId, limit = 50) {
        try {
            const membership = await this.prisma.merchantMembership.findUnique({
                where: { id: staffId },
                include: { user: true },
            });
            if (!membership) {
                throw new common_1.NotFoundException('Staff not found');
            }
            const redemptions = await this.prisma.redemption.findMany({
                where: { redeemedByUserId: membership.userId },
                take: limit,
                orderBy: { redeemedAt: 'desc' },
                include: {
                    coupon: {
                        include: {
                            order: {
                                include: {
                                    customer: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                    deal: {
                                        select: {
                                            title: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            return redemptions.map(redemption => ({
                activityType: 'REDEMPTION',
                description: `Redeemed coupon for ${redemption.coupon.order.deal.title} - Customer: ${redemption.coupon.order.customer.firstName || ''} ${redemption.coupon.order.customer.lastName || ''}`.trim(),
                entityId: redemption.couponId,
                metadata: {
                    orderNumber: redemption.coupon.order.orderNumber,
                    dealTitle: redemption.coupon.order.deal.title,
                    notes: redemption.notes,
                },
                timestamp: redemption.redeemedAt,
            }));
        }
        catch (error) {
            this.logger.error(`Failed to get staff activity for ${staffId}:`, error);
            throw error;
        }
    }
    mapToResponseDto(membership, user) {
        const metadata = membership.metadata || {};
        return {
            id: membership.id,
            firstName: metadata.firstName || '',
            lastName: metadata.lastName || '',
            email: user.email,
            phone: metadata.phone,
            role: (0, staff_dto_1.mapMerchantRoleToStaffRole)(membership.merchantRole),
            isActive: user.isActive,
            lastLoginAt: metadata.lastLoginAt ? new Date(metadata.lastLoginAt) : undefined,
            merchantId: membership.merchantId,
            merchant: membership.merchant,
            permissions: membership.permissions,
            metadata: membership.metadata,
            createdAt: membership.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = StaffService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffService);
//# sourceMappingURL=staff.service.js.map