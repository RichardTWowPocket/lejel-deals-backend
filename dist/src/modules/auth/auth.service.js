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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const profileInclude = {
    customer: true,
    merchants: {
        include: {
            merchant: true,
        },
    },
};
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    formatUser(user) {
        const merchantMemberships = user.merchants.map((membership) => ({
            id: membership.id,
            merchantId: membership.merchantId,
            merchantRole: membership.merchantRole,
            isOwner: membership.isOwner,
            permissions: membership.permissions,
            metadata: membership.metadata,
            createdAt: membership.createdAt,
            merchant: membership.merchant
                ? {
                    id: membership.merchant.id,
                    name: membership.merchant.name,
                    email: membership.merchant.email,
                    isActive: membership.merchant.isActive,
                }
                : null,
        }));
        const userWithOAuth = user;
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            avatar: userWithOAuth.avatar || null,
            provider: userWithOAuth.provider || null,
            merchantIds: merchantMemberships.map((m) => m.merchantId),
            merchantMemberships,
            customerId: user.customer?.id ?? null,
            customer: user.customer
                ? {
                    id: user.customer.id,
                    email: user.customer.email,
                    firstName: user.customer.firstName,
                    lastName: user.customer.lastName,
                    phone: user.customer.phone,
                    isActive: user.customer.isActive,
                }
                : null,
        };
    }
    async verifyCredentials(email, password) {
        const userRecord = await this.prisma.user.findUnique({
            where: { email },
            include: profileInclude,
        });
        const user = userRecord;
        if (!user || !user.hashedPassword) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            success: true,
            message: 'Credentials verified',
            data: this.formatUser(user),
        };
    }
    async registerUser(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email is already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const nameParts = (dto.name || '').trim().split(/\s+/).filter(Boolean);
        const firstName = nameParts[0] || null;
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
        const createData = {
            email: dto.email,
            hashedPassword,
            role: 'CUSTOMER',
            isActive: true,
            customer: {
                create: {
                    email: dto.email,
                    firstName,
                    lastName,
                    isActive: true,
                },
            },
        };
        const userRecord = await this.prisma.user.create({
            data: createData,
            include: profileInclude,
        });
        const user = userRecord;
        return {
            success: true,
            message: 'Registration successful',
            data: this.formatUser(user),
        };
    }
    async getProfile(userId) {
        const userRecord = await this.prisma.user.findUnique({
            where: { id: userId },
            include: profileInclude,
        });
        if (!userRecord) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.formatUser(userRecord);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.hashedPassword) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const passwordMatches = await bcrypt.compare(currentPassword, user.hashedPassword);
        if (!passwordMatches) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        if (newPassword.length < 8) {
            throw new common_1.BadRequestException('New password must be at least 8 characters');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedPassword },
        });
        return {
            success: true,
            message: 'Password changed successfully',
        };
    }
    async findOrCreateOAuthUser(dto) {
        let userRecord = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { providerId: dto.providerId, provider: 'google' },
                    { email: dto.email },
                ],
            },
            include: profileInclude,
        });
        const nameParts = dto.name
            ? dto.name.trim().split(/\s+/).filter(Boolean)
            : [];
        const firstName = dto.firstName || (nameParts[0] || null);
        const lastName = dto.lastName ||
            (nameParts.length > 1 ? nameParts.slice(1).join(' ') : null);
        if (userRecord) {
            const updateData = {};
            let needsUpdate = false;
            const userWithOAuth = userRecord;
            if (!userWithOAuth.providerId) {
                updateData.providerId = dto.providerId;
                updateData.provider = 'google';
                needsUpdate = true;
            }
            if (dto.avatar && !userWithOAuth.avatar) {
                updateData.avatar = dto.avatar;
                needsUpdate = true;
            }
            if (!userRecord.customer) {
                updateData.customer = {
                    create: {
                        email: dto.email,
                        firstName,
                        lastName,
                        isActive: true,
                    },
                };
                needsUpdate = true;
            }
            else {
                const customerUpdate = {};
                if (!userRecord.customer.firstName && firstName) {
                    customerUpdate.firstName = firstName;
                }
                if (!userRecord.customer.lastName && lastName) {
                    customerUpdate.lastName = lastName;
                }
                if (Object.keys(customerUpdate).length > 0) {
                    updateData.customer = { update: customerUpdate };
                    needsUpdate = true;
                }
            }
            if (needsUpdate) {
                userRecord = await this.prisma.user.update({
                    where: { id: userRecord.id },
                    data: updateData,
                    include: profileInclude,
                });
            }
            if (!userRecord.isActive) {
                throw new common_1.UnauthorizedException('Account is inactive');
            }
            return {
                success: true,
                message: 'User found and linked',
                data: this.formatUser(userRecord),
            };
        }
        const createData = {
            email: dto.email,
            hashedPassword: null,
            providerId: dto.providerId,
            provider: 'google',
            avatar: dto.avatar || null,
            role: 'CUSTOMER',
            isActive: true,
            customer: {
                create: {
                    email: dto.email,
                    firstName,
                    lastName,
                    isActive: true,
                },
            },
        };
        userRecord = await this.prisma.user.create({
            data: createData,
            include: profileInclude,
        });
        return {
            success: true,
            message: 'OAuth user created successfully',
            data: this.formatUser(userRecord),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map