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
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
let StaffService = StaffService_1 = class StaffService {
    prisma;
    logger = new common_1.Logger(StaffService_1.name);
    jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    jwtExpiresIn = '8h';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStaffDto) {
        try {
            const existingStaff = await this.prisma.staff.findUnique({
                where: { email: createStaffDto.email },
            });
            if (existingStaff) {
                throw new common_1.ConflictException('Staff with this email already exists');
            }
            const hashedPin = await bcrypt.hash(createStaffDto.pin, 10);
            const staff = await this.prisma.staff.create({
                data: {
                    ...createStaffDto,
                    pin: hashedPin,
                    role: createStaffDto.role || client_1.StaffRole.CASHIER,
                },
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
            this.logger.log(`Staff created: ${staff.email} (${staff.role})`);
            return this.mapToResponseDto(staff);
        }
        catch (error) {
            this.logger.error('Failed to create staff:', error);
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, merchantId, role, isActive) {
        try {
            const skip = (page - 1) * limit;
            const where = {};
            if (merchantId) {
                where.merchantId = merchantId;
            }
            if (role) {
                where.role = role;
            }
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            const [staff, total] = await Promise.all([
                this.prisma.staff.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
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
                this.prisma.staff.count({ where }),
            ]);
            const staffResponse = staff.map(s => this.mapToResponseDto(s));
            return {
                staff: staffResponse,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to find staff:', error);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const staff = await this.prisma.staff.findUnique({
                where: { id },
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
                throw new common_1.NotFoundException('Staff not found');
            }
            return this.mapToResponseDto(staff);
        }
        catch (error) {
            this.logger.error(`Failed to find staff ${id}:`, error);
            throw error;
        }
    }
    async findByEmail(email) {
        try {
            const staff = await this.prisma.staff.findUnique({
                where: { email },
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
                throw new common_1.NotFoundException('Staff not found');
            }
            return this.mapToResponseDto(staff);
        }
        catch (error) {
            this.logger.error(`Failed to find staff by email ${email}:`, error);
            throw error;
        }
    }
    async update(id, updateStaffDto) {
        try {
            const existingStaff = await this.prisma.staff.findUnique({
                where: { id },
            });
            if (!existingStaff) {
                throw new common_1.NotFoundException('Staff not found');
            }
            if (updateStaffDto.email && updateStaffDto.email !== existingStaff.email) {
                const emailExists = await this.prisma.staff.findUnique({
                    where: { email: updateStaffDto.email },
                });
                if (emailExists) {
                    throw new common_1.ConflictException('Staff with this email already exists');
                }
            }
            const updateData = { ...updateStaffDto };
            if (updateStaffDto.pin) {
                updateData.pin = await bcrypt.hash(updateStaffDto.pin, 10);
            }
            const staff = await this.prisma.staff.update({
                where: { id },
                data: updateData,
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
            this.logger.log(`Staff updated: ${staff.email}`);
            return this.mapToResponseDto(staff);
        }
        catch (error) {
            this.logger.error(`Failed to update staff ${id}:`, error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const staff = await this.prisma.staff.findUnique({
                where: { id },
            });
            if (!staff) {
                throw new common_1.NotFoundException('Staff not found');
            }
            await this.prisma.staff.delete({
                where: { id },
            });
            this.logger.log(`Staff deleted: ${staff.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete staff ${id}:`, error);
            throw error;
        }
    }
    async login(loginDto) {
        try {
            const staff = await this.prisma.staff.findFirst({
                where: {
                    OR: [
                        { email: loginDto.identifier },
                        { pin: loginDto.identifier },
                    ],
                    isActive: true,
                },
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
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPinValid = await bcrypt.compare(loginDto.pin, staff.pin);
            if (!isPinValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            await this.prisma.staff.update({
                where: { id: staff.id },
                data: { lastLoginAt: new Date() },
            });
            const payload = {
                sub: staff.id,
                email: staff.email,
                role: staff.role,
                merchantId: staff.merchantId,
                type: 'staff',
            };
            const accessToken = jwt.sign(payload, this.jwtSecret, {
                expiresIn: this.jwtExpiresIn,
            });
            this.logger.log(`Staff logged in: ${staff.email}`);
            return {
                staff: this.mapToResponseDto(staff),
                accessToken,
                expiresIn: 8 * 60 * 60,
            };
        }
        catch (error) {
            this.logger.error('Staff login failed:', error);
            throw error;
        }
    }
    async changePin(id, changePinDto) {
        try {
            const staff = await this.prisma.staff.findUnique({
                where: { id },
            });
            if (!staff) {
                throw new common_1.NotFoundException('Staff not found');
            }
            const isCurrentPinValid = await bcrypt.compare(changePinDto.currentPin, staff.pin);
            if (!isCurrentPinValid) {
                throw new common_1.BadRequestException('Current PIN is incorrect');
            }
            const hashedNewPin = await bcrypt.hash(changePinDto.newPin, 10);
            await this.prisma.staff.update({
                where: { id },
                data: { pin: hashedNewPin },
            });
            this.logger.log(`Staff PIN changed: ${staff.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to change PIN for staff ${id}:`, error);
            throw error;
        }
    }
    async deactivate(id) {
        try {
            const staff = await this.prisma.staff.update({
                where: { id },
                data: { isActive: false },
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
            this.logger.log(`Staff deactivated: ${staff.email}`);
            return this.mapToResponseDto(staff);
        }
        catch (error) {
            this.logger.error(`Failed to deactivate staff ${id}:`, error);
            throw error;
        }
    }
    async activate(id) {
        try {
            const staff = await this.prisma.staff.update({
                where: { id },
                data: { isActive: true },
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
            this.logger.log(`Staff activated: ${staff.email}`);
            return this.mapToResponseDto(staff);
        }
        catch (error) {
            this.logger.error(`Failed to activate staff ${id}:`, error);
            throw error;
        }
    }
    async getStats() {
        try {
            const [totalStaff, activeStaff, staffByRole, staffByMerchant, recentLogins, redemptionStats,] = await Promise.all([
                this.prisma.staff.count(),
                this.prisma.staff.count({ where: { isActive: true } }),
                this.prisma.staff.groupBy({
                    by: ['role'],
                    _count: { id: true },
                }),
                this.prisma.staff.groupBy({
                    by: ['merchantId'],
                    _count: { id: true },
                    where: { merchantId: { not: null } },
                }),
                this.prisma.staff.count({
                    where: {
                        lastLoginAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                        },
                    },
                }),
                this.prisma.redemption.groupBy({
                    by: ['staffId'],
                    _count: { id: true },
                }),
            ]);
            const merchantIds = staffByMerchant.map(s => s.merchantId).filter((id) => id !== null);
            const merchants = await this.prisma.merchant.findMany({
                where: { id: { in: merchantIds } },
                select: { id: true, name: true },
            });
            const merchantMap = merchants.reduce((acc, merchant) => {
                acc[merchant.id] = merchant.name;
                return acc;
            }, {});
            const staffIds = redemptionStats.map(r => r.staffId).filter((id) => id !== null);
            const staffMembers = await this.prisma.staff.findMany({
                where: { id: { in: staffIds } },
                select: { id: true, firstName: true, lastName: true },
            });
            const staffMap = staffMembers.reduce((acc, staff) => {
                acc[staff.id] = `${staff.firstName} ${staff.lastName}`;
                return acc;
            }, {});
            const roleStats = {
                MANAGER: 0,
                CASHIER: 0,
                SUPERVISOR: 0,
                ADMIN: 0,
            };
            staffByRole.forEach(role => {
                roleStats[role.role] = role._count.id;
            });
            const totalRedemptions = redemptionStats.reduce((sum, stat) => sum + stat._count.id, 0);
            const averageRedemptionsPerStaff = activeStaff > 0 ? totalRedemptions / activeStaff : 0;
            const mostActiveStaff = redemptionStats
                .filter(stat => stat.staffId !== null)
                .map(stat => ({
                staffId: stat.staffId,
                staffName: staffMap[stat.staffId] || 'Unknown Staff',
                redemptions: stat._count.id,
            }))
                .sort((a, b) => b.redemptions - a.redemptions)
                .slice(0, 5);
            return {
                totalStaff,
                activeStaff,
                staffByRole: roleStats,
                staffByMerchant: staffByMerchant.map(stat => ({
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
            const redemptions = await this.prisma.redemption.findMany({
                where: { staffId },
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
                description: `Redeemed coupon for ${redemption.coupon.order.deal.title} - Customer: ${redemption.coupon.order.customer.firstName} ${redemption.coupon.order.customer.lastName}`,
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
    mapToResponseDto(staff) {
        return {
            id: staff.id,
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email,
            phone: staff.phone,
            role: staff.role,
            isActive: staff.isActive,
            lastLoginAt: staff.lastLoginAt,
            merchantId: staff.merchantId,
            merchant: staff.merchant,
            permissions: staff.permissions,
            metadata: staff.metadata,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
        };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = StaffService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffService);
//# sourceMappingURL=staff.service.js.map