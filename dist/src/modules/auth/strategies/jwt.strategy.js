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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        const jwtSecret = process.env.NEXTAUTH_SECRET;
        if (!jwtSecret) {
            throw new Error('NEXTAUTH_SECRET environment variable is required');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }
    async validate(payload) {
        console.warn('🔐 JWT Token Payload:', {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
            merchantIds: payload.merchantIds,
            customerId: payload.customerId,
            iss: payload.iss,
            aud: payload.aud,
            iat: payload.iat,
            exp: payload.exp,
            fullPayload: payload,
        });
        if (payload.iss !== 'lejel-auth' || payload.aud !== 'lejel-api') {
            throw new common_1.UnauthorizedException('Invalid token issuer or audience');
        }
        const user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role || 'customer',
            merchantIds: payload.merchantIds || [],
        };
        if (!user.id || !user.email) {
            throw new common_1.UnauthorizedException('Invalid token payload');
        }
        console.warn('✅ Validated AuthUser:', {
            id: user.id,
            email: user.email,
            role: user.role,
            merchantIds: user.merchantIds,
        });
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map