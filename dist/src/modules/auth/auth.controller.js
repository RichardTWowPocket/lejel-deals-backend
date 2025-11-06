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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const auth_decorators_1 = require("./decorators/auth.decorators");
const auth_dto_1 = require("./dto/auth.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    healthCheck() {
        return { status: 'ok', message: 'Auth service is running' };
    }
    async verifyCredentials(body) {
        return this.authService.verifyCredentials(body.email, body.password);
    }
    async register(body) {
        return this.authService.registerUser(body);
    }
    async getProfile(user) {
        return this.authService.getProfile(user.id);
    }
    async oauthGoogle(body) {
        return this.authService.findOrCreateOAuthUser(body);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check for auth service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auth service is running' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "healthCheck", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('verify'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify user credentials (NextAuth authorize support)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Credentials valid' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyCredentials", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Registration successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid registration data' }),
    (0, throttler_1.Throttle)({ short: { limit: 3, ttl: 60 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user profile' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('oauth/google'),
    (0, swagger_1.ApiOperation)({
        summary: 'Find or create user from Google OAuth (NextAuth support)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User found or created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Account is inactive' }),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.OAuthGoogleDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oauthGoogle", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map