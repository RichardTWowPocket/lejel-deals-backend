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
exports.RedemptionController = void 0;
const common_1 = require("@nestjs/common");
const redemptions_service_1 = require("./redemptions.service");
const redemption_dto_1 = require("./dto/redemption.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let RedemptionController = class RedemptionController {
    redemptionService;
    constructor(redemptionService) {
        this.redemptionService = redemptionService;
    }
    async processRedemption(createRedemptionDto) {
        return this.redemptionService.processRedemption(createRedemptionDto.qrToken, createRedemptionDto.staffId, createRedemptionDto.notes, createRedemptionDto.location);
    }
    async validateRedemption(body) {
        return this.redemptionService.validateRedemption(body.qrToken, body.staffId);
    }
    async findAll(page, limit, merchantId, staffId, status, startDate, endDate) {
        return this.redemptionService.findAll(page, limit, merchantId, staffId, status, startDate, endDate);
    }
    async getRedemptionStats(merchantId) {
        return this.redemptionService.getRedemptionStats(merchantId);
    }
    async getRedemptionAnalytics(merchantId, startDate, endDate) {
        return this.redemptionService.getRedemptionAnalytics(merchantId, startDate, endDate);
    }
    async findOne(id) {
        return this.redemptionService.findOne(id);
    }
    async updateStatus(id, body) {
        return this.redemptionService.updateStatus(id, body.status, body.notes);
    }
    async getStaffRedemptions(staffId, page, limit, status) {
        return this.redemptionService.findAll(page, limit, undefined, staffId, status);
    }
    async getMerchantRedemptions(merchantId, page, limit, status, startDate, endDate) {
        return this.redemptionService.findAll(page, limit, merchantId, undefined, status, startDate, endDate);
    }
    async getCustomerRedemptions(customerId, page, limit, status) {
        return this.redemptionService.findAll(page, limit, undefined, undefined, status);
    }
    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date(),
            service: 'Redemption Service',
        };
    }
};
exports.RedemptionController = RedemptionController;
__decorate([
    (0, common_1.Post)('process'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Process a redemption with QR code validation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Redemption processed successfully', type: redemption_dto_1.RedemptionResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [redemption_dto_1.CreateRedemptionDto]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "processRedemption", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validate redemption before processing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemption validation result', type: redemption_dto_1.RedemptionValidationDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "validateRedemption", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of redemptions with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemptions retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant ID' }),
    (0, swagger_1.ApiQuery)({ name: 'staffId', required: false, type: String, description: 'Filter by staff ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.RedemptionStatus, description: 'Filter by redemption status' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date, description: 'Filter by start date' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date, description: 'Filter by end date' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('merchantId')),
    __param(3, (0, common_1.Query)('staffId')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get redemption statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemption statistics retrieved successfully', type: redemption_dto_1.RedemptionStatsDto }),
    (0, swagger_1.ApiQuery)({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant ID' }),
    __param(0, (0, common_1.Query)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "getRedemptionStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get redemption analytics and insights' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemption analytics retrieved successfully', type: redemption_dto_1.RedemptionAnalyticsDto }),
    (0, swagger_1.ApiQuery)({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant ID' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date, description: 'Filter by start date' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date, description: 'Filter by end date' }),
    __param(0, (0, common_1.Query)('merchantId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "getRedemptionAnalytics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get redemption by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemption retrieved successfully', type: redemption_dto_1.RedemptionResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update redemption status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemption status updated successfully', type: redemption_dto_1.RedemptionResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get redemptions by staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff redemptions retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.RedemptionStatus, description: 'Filter by redemption status' }),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "getStaffRedemptions", null);
__decorate([
    (0, common_1.Get)('merchant/:merchantId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get redemptions by merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant redemptions retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.RedemptionStatus, description: 'Filter by redemption status' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date, description: 'Filter by start date' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date, description: 'Filter by end date' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "getMerchantRedemptions", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.MERCHANT, client_1.UserRole.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get redemptions by customer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer redemptions retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.RedemptionStatus, description: 'Filter by redemption status' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "getCustomerRedemptions", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Redemption service health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RedemptionController.prototype, "healthCheck", null);
exports.RedemptionController = RedemptionController = __decorate([
    (0, swagger_1.ApiTags)('Redemptions'),
    (0, common_1.Controller)('redemptions'),
    __metadata("design:paramtypes", [redemptions_service_1.RedemptionService])
], RedemptionController);
//# sourceMappingURL=redemptions.controller.js.map