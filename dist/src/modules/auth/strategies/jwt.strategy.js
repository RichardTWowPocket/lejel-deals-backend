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
        const jwtSecret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('NEXTAUTH_SECRET or SUPABASE_JWT_SECRET environment variable is required');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
            passReqToCallback: true,
        });
    }
    async validate(req, payload) {
        console.log('[JwtStrategy] Payload received:', payload);
        if (payload.sub && payload.email) {
            const user = {
                id: payload.sub,
                email: payload.email,
                role: payload.role || 'customer',
                user_metadata: payload.user_metadata || {},
            };
            console.log('[JwtStrategy] NextAuth user:', user);
            return user;
        }
        const rawRole = payload?.role || payload?.app_metadata?.role || payload?.user_metadata?.role;
        const normalizedRole = (rawRole === 'authenticated' || !rawRole) ? 'customer' : String(rawRole).toLowerCase();
        const user = {
            id: payload.sub || payload.id,
            email: payload.email,
            role: normalizedRole,
            user_metadata: payload.user_metadata || {},
        };
        if (!user.id || !user.email) {
            throw new common_1.UnauthorizedException('Invalid token payload');
        }
        console.log('[JwtStrategy] Supabase user:', user);
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map