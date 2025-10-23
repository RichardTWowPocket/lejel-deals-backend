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
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(_loginDto) {
        throw new common_1.UnauthorizedException('Login is handled by NextAuth');
    }
    async register(_registerDto) {
        throw new common_1.UnauthorizedException('Registration is handled by NextAuth');
    }
    async validateUser(token) {
        const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_JWT_SECRET;
        if (!secret) {
            throw new common_1.UnauthorizedException('Auth secret not configured');
        }
        try {
            const payload = jwt.verify(token, secret);
            if (!payload?.sub || !payload?.email) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return {
                id: payload.sub,
                email: payload.email,
                role: payload.role || 'customer',
                user_metadata: payload.user_metadata || {},
            };
        }
        catch (_err) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async getUserById(_userId) {
        return null;
    }
    async getSupabaseClient() {
        throw new common_1.UnauthorizedException('Supabase client is not available');
    }
    async verifyCredentials(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const ok = await bcrypt.compare(password, user.hashedPassword);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        let merchantIds = [];
        if (user.role === 'MERCHANT') {
            const memberships = await this.prisma.merchantUser.findMany({
                where: { userId: user.id },
                select: { merchantId: true },
            });
            merchantIds = memberships.map((m) => m.merchantId);
        }
        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role.toLowerCase(),
                merchantIds,
            },
            message: 'Credentials verified',
        };
    }
    async registerUser(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.UnauthorizedException('Email already registered');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const role = 'CUSTOMER';
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hashedPassword: hashed,
                role,
                isActive: true,
            },
        });
        if (role === 'CUSTOMER') {
            const rawName = (dto.name || '').trim();
            const parts = rawName.split(/\s+/).filter(Boolean);
            const firstName = parts.length > 0 ? parts[0] : undefined;
            const lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;
            await this.prisma.customer.create({
                data: {
                    email: dto.email,
                    userId: user.id,
                    firstName,
                    lastName,
                },
            });
        }
        return {
            success: true,
            data: { id: user.id, email: user.email, role: role.toLowerCase() },
            message: 'Registration successful',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map