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
exports.QRCodeSecurityController = void 0;
const common_1 = require("@nestjs/common");
const qr_security_service_1 = require("./qr-security.service");
const qr_security_dto_1 = require("./dto/qr-security.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let QRCodeSecurityController = class QRCodeSecurityController {
    qrSecurityService;
    constructor(qrSecurityService) {
        this.qrSecurityService = qrSecurityService;
    }
    async generateQRCode(generateQRCodeDto) {
        const qrToken = await this.qrSecurityService.generateSecureQRCode(generateQRCodeDto.couponId);
        const validation = await this.qrSecurityService.validateQRCode(qrToken);
        return {
            qrToken,
            expiresAt: validation.payload.expiresAt,
            issuedAt: validation.payload.issuedAt,
            coupon: {
                id: validation.coupon.id,
                orderId: validation.coupon.orderId,
                dealId: validation.coupon.dealId,
                status: validation.coupon.status,
                expiresAt: validation.coupon.expiresAt,
            },
            order: {
                id: validation.order.id,
                orderNumber: validation.order.orderNumber,
                customerId: validation.order.customerId,
                totalAmount: Number(validation.order.totalAmount),
            },
            deal: {
                id: validation.deal.id,
                title: validation.deal.title,
                merchantId: validation.deal.merchantId,
            },
            customer: {
                id: validation.customer.id,
                firstName: validation.customer.firstName,
                lastName: validation.customer.lastName,
                email: validation.customer.email,
            },
            merchant: {
                id: validation.merchant.id,
                name: validation.merchant.name,
                email: validation.merchant.email,
            },
        };
    }
    async validateQRCode(validateQRCodeDto) {
        return this.qrSecurityService.validateQRCode(validateQRCodeDto.qrToken, validateQRCodeDto.staffId);
    }
    async redeemQRCode(redeemQRCodeDto) {
        const validation = await this.qrSecurityService.validateQRCode(redeemQRCodeDto.qrToken, redeemQRCodeDto.staffId);
        if (!validation.isValid) {
            return {
                success: false,
                message: validation.error || 'Invalid QR code',
            };
        }
        await this.qrSecurityService.markQRCodeAsUsed(validation.payload.couponId, redeemQRCodeDto.staffId, redeemQRCodeDto.notes);
        return {
            success: true,
            message: 'QR code redeemed successfully',
        };
    }
    async revokeQRCode(revokeQRCodeDto) {
        await this.qrSecurityService.revokeQRCode(revokeQRCodeDto.couponId, revokeQRCodeDto.reason);
        return {
            success: true,
            message: 'QR code revoked successfully',
        };
    }
    async getQRCodeStats() {
        return this.qrSecurityService.getQRCodeStats();
    }
    async getQRCodeHistory(couponId) {
        const activities = await this.qrSecurityService.getQRCodeHistory(couponId);
        return {
            activities,
            total: activities.length,
        };
    }
    async cleanupExpiredQRCodes() {
        const cleanedCount = await this.qrSecurityService.cleanupExpiredQRCodes();
        return {
            success: true,
            cleanedCount,
            message: `Cleaned up ${cleanedCount} expired QR codes`,
        };
    }
    async validateQRCodeByToken(qrToken, staffId) {
        return this.qrSecurityService.validateQRCode(qrToken, staffId);
    }
    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date(),
            service: 'QR Code Security Service',
        };
    }
};
exports.QRCodeSecurityController = QRCodeSecurityController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate secure QR code for coupon' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'QR code generated successfully', type: qr_security_dto_1.QRCodeResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qr_security_dto_1.GenerateQRCodeDto]),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "generateQRCode", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validate QR code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code validation result', type: qr_security_dto_1.QRCodeValidationResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qr_security_dto_1.ValidateQRCodeDto]),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "validateQRCode", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem QR code (mark as used)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code redeemed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qr_security_dto_1.RedeemQRCodeDto]),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "redeemQRCode", null);
__decorate([
    (0, common_1.Post)('revoke'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke QR code (invalidate it)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code revoked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qr_security_dto_1.RevokeQRCodeDto]),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "revokeQRCode", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get QR code security statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code statistics retrieved successfully', type: qr_security_dto_1.QRCodeStatsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "getQRCodeStats", null);
__decorate([
    (0, common_1.Get)('history/:couponId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get QR code activity history for a coupon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code history retrieved successfully', type: qr_security_dto_1.QRCodeHistoryDto }),
    __param(0, (0, common_1.Param)('couponId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "getQRCodeHistory", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clean up expired QR codes (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired QR codes cleaned up successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "cleanupExpiredQRCodes", null);
__decorate([
    (0, common_1.Get)('validate/:qrToken'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validate QR code via URL parameter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code validation result', type: qr_security_dto_1.QRCodeValidationResponseDto }),
    __param(0, (0, common_1.Param)('qrToken')),
    __param(1, (0, common_1.Query)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "validateQRCodeByToken", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'QR code security service health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QRCodeSecurityController.prototype, "healthCheck", null);
exports.QRCodeSecurityController = QRCodeSecurityController = __decorate([
    (0, swagger_1.ApiTags)('QR Code Security'),
    (0, common_1.Controller)('qr-security'),
    __metadata("design:paramtypes", [qr_security_service_1.QRCodeSecurityService])
], QRCodeSecurityController);
//# sourceMappingURL=qr-security.controller.js.map