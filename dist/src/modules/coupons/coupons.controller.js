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
exports.CouponsController = void 0;
const common_1 = require("@nestjs/common");
const coupons_service_1 = require("./coupons.service");
const coupon_dto_1 = require("./dto/coupon.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let CouponsController = class CouponsController {
    couponsService;
    constructor(couponsService) {
        this.couponsService = couponsService;
    }
    async findAll(page, limit, status, orderId, dealId) {
        return this.couponsService.findAll(page, limit, status, orderId, dealId);
    }
    async findMine(user, page, limit, status) {
        return this.couponsService.findMine(user.id, Number(page) || 1, Number(limit) || 10, status);
    }
    async getStats() {
        return this.couponsService.getStats();
    }
    async findByOrder(orderId) {
        return this.couponsService.findByOrder(orderId);
    }
    async findByQRCode(qrCode) {
        return this.couponsService.findByQRCode(qrCode);
    }
    async findOne(id) {
        return this.couponsService.findOne(id);
    }
    async validateCoupon(validationDto) {
        return this.couponsService.validateCoupon(validationDto.qrCode);
    }
    async redeemCoupon(redeemDto) {
        return this.couponsService.redeemCoupon(redeemDto.qrCode, redeemDto.staffId, redeemDto.notes);
    }
    async expireCoupons() {
        const expiredCount = await this.couponsService.expireCoupons();
        return {
            message: `${expiredCount} coupons expired successfully`,
            expiredCount,
        };
    }
    async generateQRCode(generateDto) {
        const qrCode = await this.couponsService.generateQRCodeData(generateDto.couponId);
        return { qrCode };
    }
    async cancelCoupon(id, cancelDto) {
        return this.couponsService.cancelCoupon(id, cancelDto.reason);
    }
};
exports.CouponsController = CouponsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all coupons with pagination and filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.CouponStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'orderId', required: false, type: String, description: 'Filter by order ID' }),
    (0, swagger_1.ApiQuery)({ name: 'dealId', required: false, type: String, description: 'Filter by deal ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons retrieved successfully' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('orderId')),
    __param(4, (0, common_1.Query)('dealId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupons for current authenticated customer' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.CouponStatus, description: 'Filter by status' }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon statistics retrieved successfully', type: coupon_dto_1.CouponStatsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupons for a specific order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons retrieved successfully', type: [coupon_dto_1.CouponResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "findByOrder", null);
__decorate([
    (0, common_1.Get)('qr/:qrCode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon by QR code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon retrieved successfully', type: coupon_dto_1.CouponResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Coupon not found' }),
    __param(0, (0, common_1.Param)('qrCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "findByQRCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon retrieved successfully', type: coupon_dto_1.CouponResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Coupon not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a coupon QR code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon validation result', type: coupon_dto_1.CouponValidationResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.CouponValidationDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "validateCoupon", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a coupon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon redeemed successfully', type: coupon_dto_1.CouponResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid coupon or already used' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.RedeemCouponDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "redeemCoupon", null);
__decorate([
    (0, common_1.Post)('expire'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Expire all overdue coupons' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons expired successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "expireCoupons", null);
__decorate([
    (0, common_1.Post)('qr-code'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate QR code for a coupon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Coupon not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.GenerateQRCodeDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "generateQRCode", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a coupon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon cancelled successfully', type: coupon_dto_1.CouponResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Coupon cannot be cancelled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Coupon not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coupon_dto_1.CancelCouponDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "cancelCoupon", null);
exports.CouponsController = CouponsController = __decorate([
    (0, swagger_1.ApiTags)('Coupons'),
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupons_service_1.CouponsService])
], CouponsController);
//# sourceMappingURL=coupons.controller.js.map