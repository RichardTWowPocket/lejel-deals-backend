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
exports.DealsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const deals_service_1 = require("./deals.service");
const create_deal_dto_1 = require("./dto/create-deal.dto");
const deal_response_dto_1 = require("./dto/deal-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
let DealsController = class DealsController {
    dealsService;
    constructor(dealsService) {
        this.dealsService = dealsService;
    }
    async findAll(page, limit, status, merchantId, categoryId, search, featured, sortBy, sortOrder) {
        return this.dealsService.findAll({
            page,
            limit,
            status,
            merchantId,
            categoryId,
            search,
            featured,
            sortBy,
            sortOrder,
        });
    }
    async findActive(page, limit) {
        return this.dealsService.findActive(page, limit);
    }
    async findByStatus(status, page, limit) {
        return this.dealsService.findByStatus(status, page, limit);
    }
    async findByMerchant(merchantId, page, limit) {
        return this.dealsService.findByMerchant(merchantId, page, limit);
    }
    async findByCategory(categoryId, page, limit) {
        return this.dealsService.findByCategory(categoryId, page, limit);
    }
    async getStats() {
        return this.dealsService.getStats();
    }
    async findOne(id) {
        try {
            return await this.dealsService.findOne(id);
        }
        catch (error) {
            return await this.dealsService.findBySlug(id);
        }
    }
    async create(createDealDto, user) {
        return this.dealsService.create(createDealDto, user.id);
    }
    async update(id, updateDealDto, user) {
        return this.dealsService.update(id, updateDealDto, user.id);
    }
    async updateStatus(id, updateStatusDto, user) {
        return this.dealsService.updateStatus(id, updateStatusDto, user.id);
    }
    async publish(id, user) {
        return this.dealsService.publish(id, user.id);
    }
    async pause(id, user) {
        return this.dealsService.pause(id, user.id);
    }
    async checkExpiredDeals() {
        return this.dealsService.checkExpiredDeals();
    }
    async checkSoldOutDeals() {
        return this.dealsService.checkSoldOutDeals();
    }
    async remove(id, user) {
        await this.dealsService.remove(id, user.id);
    }
};
exports.DealsController = DealsController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all deals with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.DealStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String, description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search in title/description' }),
    (0, swagger_1.ApiQuery)({ name: 'featured', required: false, type: Boolean, description: 'Filter featured deals' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Sort by field' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deals retrieved successfully', type: deal_response_dto_1.DealListResponseDto }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('merchantId')),
    __param(4, (0, common_1.Query)('categoryId')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('featured')),
    __param(7, (0, common_1.Query)('sortBy')),
    __param(8, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, Boolean, String, String]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findAll", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active deals' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active deals retrieved successfully' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findActive", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deals by status' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deals retrieved successfully' }),
    __param(0, (0, common_1.Param)('status')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findByStatus", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deals by merchant' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant deals retrieved successfully' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findByMerchant", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deals by category' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deals retrieved successfully' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findByCategory", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deal statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deal statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "getStats", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deal by ID or slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deal retrieved successfully', type: deal_response_dto_1.DealResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new deal' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Deal created successfully', type: deal_response_dto_1.DealResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid deal data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant or category not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deal_dto_1.CreateDealDto, Object]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update deal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deal updated successfully', type: deal_response_dto_1.DealResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid update data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_deal_dto_1.UpdateDealDto, Object]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update deal status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deal status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_deal_dto_1.UpdateDealStatusDto, Object]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN),
    (0, common_1.Post)(':id/publish'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish deal (DRAFT -> ACTIVE)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deal published successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "publish", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN),
    (0, common_1.Post)(':id/pause'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Pause deal (ACTIVE -> PAUSED)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deal paused successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "pause", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('expired/check'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Check and update expired deals (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired deals updated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "checkExpiredDeals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('sold-out/check'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Check and update sold out deals (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sold out deals updated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "checkSoldOutDeals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete deal (Admin only - soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Deal deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "remove", null);
exports.DealsController = DealsController = __decorate([
    (0, swagger_1.ApiTags)('Deals'),
    (0, common_1.Controller)('deals'),
    __metadata("design:paramtypes", [deals_service_1.DealsService])
], DealsController);
//# sourceMappingURL=deals.controller.js.map