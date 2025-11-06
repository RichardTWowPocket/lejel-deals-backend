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
exports.MerchantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const merchants_service_1 = require("./merchants.service");
const create_merchant_dto_1 = require("./dto/create-merchant.dto");
const update_merchant_dto_1 = require("./dto/update-merchant.dto");
const merchant_verification_dto_1 = require("./dto/merchant-verification.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_2 = require("@nestjs/common");
let MerchantsController = class MerchantsController {
    merchantsService;
    prisma;
    constructor(merchantsService, prisma) {
        this.merchantsService = merchantsService;
        this.prisma = prisma;
    }
    async getMerchantIdForUser(userId) {
        const membership = await this.prisma.merchantMembership.findFirst({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
        if (!membership) {
            throw new common_2.ForbiddenException('User is not associated with any merchant');
        }
        return membership.merchantId;
    }
    create(createMerchantDto, user) {
        return this.merchantsService.create(createMerchantDto, user.id);
    }
    findAll(page, limit, search, city, isActive) {
        const isActiveBool = isActive ? isActive === 'true' : undefined;
        return this.merchantsService.findAll(page, limit, search, city, isActiveBool);
    }
    search(query, city, isActive) {
        const isActiveBool = isActive ? isActive === 'true' : undefined;
        return this.merchantsService.searchMerchants(query, {
            city,
            isActive: isActiveBool,
        });
    }
    findOne(id) {
        return this.merchantsService.findOne(id);
    }
    findByEmail(email) {
        return this.merchantsService.findByEmail(email);
    }
    update(id, updateMerchantDto, user) {
        return this.merchantsService.update(id, updateMerchantDto, user.id);
    }
    remove(id, user) {
        return this.merchantsService.remove(id, user.id);
    }
    updateVerification(id, verificationDto, user) {
        return this.merchantsService.updateVerificationStatus(id, verificationDto, user.id);
    }
    getVerificationStatus(id) {
        return this.merchantsService.getVerificationStatus(id);
    }
    updateOperatingHours(id, operatingHours, user) {
        return this.merchantsService.updateOperatingHours(id, operatingHours, user.id);
    }
    getOperatingHours(id) {
        return this.merchantsService.getOperatingHours(id);
    }
    getStats(id, user) {
        return this.merchantsService.getMerchantStats(id);
    }
    async getMyOverview(user, merchantId) {
        let finalMerchantId;
        if (merchantId) {
            const membership = await this.prisma.merchantMembership.findFirst({
                where: {
                    userId: user.id,
                    merchantId: merchantId,
                },
            });
            if (!membership) {
                throw new common_2.ForbiddenException('You do not have access to this merchant');
            }
            finalMerchantId = merchantId;
        }
        else {
            finalMerchantId = await this.getMerchantIdForUser(user.id);
        }
        return this.merchantsService.getMerchantOverview(finalMerchantId);
    }
    async getMyPayouts(user, period, merchantId) {
        let finalMerchantId;
        if (merchantId) {
            const membership = await this.prisma.merchantMembership.findFirst({
                where: {
                    userId: user.id,
                    merchantId: merchantId,
                },
            });
            if (!membership) {
                throw new common_2.ForbiddenException('You do not have access to this merchant');
            }
            finalMerchantId = merchantId;
        }
        else {
            finalMerchantId = await this.getMerchantIdForUser(user.id);
        }
        return this.merchantsService.getMerchantPayouts(finalMerchantId, period || 'all');
    }
    getOverview(id, user) {
        return this.merchantsService.getMerchantOverview(id);
    }
    getPayouts(id, period, user) {
        return this.merchantsService.getMerchantPayouts(id, period || 'all');
    }
    deactivate(id, user) {
        return this.merchantsService.deactivate(id, user.id);
    }
    reactivate(id, user) {
        return this.merchantsService.reactivate(id, user.id);
    }
};
exports.MerchantsController = MerchantsController;
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new merchant' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Merchant created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or email already exists',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_merchant_dto_1.CreateMerchantDto, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "create", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all merchants with pagination and filtering' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Items per page',
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, description: 'Filter by city' }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        description: 'Filter by active status',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated merchants list' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('city')),
    __param(4, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "findAll", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search merchants' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Search query', example: 'restaurant' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, description: 'Filter by city' }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        description: 'Filter by active status',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns search results' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "search", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the merchant' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "findOne", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('email/:email'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant by email' }),
    (0, swagger_1.ApiParam)({ name: 'email', description: 'Merchant email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the merchant' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "findByEmail", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a merchant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or email already taken',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_merchant_dto_1.UpdateMerchantDto, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "update", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a merchant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant deleted successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot delete merchant with active deals',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "remove", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Patch)(':id/verification'),
    (0, swagger_1.ApiOperation)({ summary: 'Update merchant verification status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_verification_dto_1.MerchantVerificationDto, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "updateVerification", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(':id/verification'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant verification status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns verification status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "getVerificationStatus", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)(':id/operating-hours'),
    (0, swagger_1.ApiOperation)({ summary: 'Update merchant operating hours' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Operating hours updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "updateOperatingHours", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(':id/operating-hours'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant operating hours' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns operating hours' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "getOperatingHours", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant statistics' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns merchant statistics' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('me/overview'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiOperation)({
        summary: "Get current merchant's overview - today's metrics for dashboard",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'merchantId',
        required: false,
        description: 'Optional merchant ID (for multi-merchant users). If not provided, uses first merchant.',
    }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns merchant overview with today's KPIs",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - user is not a merchant or does not have access to merchant',
    }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMyOverview", null);
__decorate([
    (0, common_1.Get)('me/payouts'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiOperation)({
        summary: "Get current merchant's payouts and revenue calculations",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: ['day', 'week', 'month', 'year', 'all'],
        description: 'Time period for payouts',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'merchantId',
        required: false,
        description: 'Optional merchant ID (for multi-merchant users). If not provided, uses first merchant.',
    }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns merchant payouts and revenue data',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - user is not a merchant or does not have access to merchant',
    }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMyPayouts", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)(':id/overview'),
    (0, swagger_1.ApiOperation)({
        summary: "Get merchant overview - today's metrics for dashboard",
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns merchant overview with today's KPIs",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "getOverview", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)(':id/payouts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant payouts and revenue calculations' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: ['day', 'week', 'month', 'year', 'all'],
        description: 'Time period for payouts',
    }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns merchant payouts and revenue data',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "getPayouts", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a merchant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant deactivated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "deactivate", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Patch)(':id/reactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate a merchant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant reactivated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MerchantsController.prototype, "reactivate", null);
exports.MerchantsController = MerchantsController = __decorate([
    (0, swagger_1.ApiTags)('Merchants'),
    (0, common_1.Controller)('merchants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [merchants_service_1.MerchantsService,
        prisma_service_1.PrismaService])
], MerchantsController);
//# sourceMappingURL=merchants.controller.js.map