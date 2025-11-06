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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("./staff.service");
const staff_dto_1 = require("./dto/staff.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let StaffController = class StaffController {
    staffService;
    constructor(staffService) {
        this.staffService = staffService;
    }
    async create(createStaffDto) {
        return this.staffService.create(createStaffDto);
    }
    async findAll(page, limit, merchantId, role, isActive) {
        return this.staffService.findAll(page, limit, merchantId, role, isActive);
    }
    async getStats() {
        return this.staffService.getStats();
    }
    async findOne(id) {
        return this.staffService.findOne(id);
    }
    async findByEmail(email) {
        return this.staffService.findByEmail(email);
    }
    async update(id, updateStaffDto) {
        return this.staffService.update(id, updateStaffDto);
    }
    async remove(id) {
        return this.staffService.remove(id);
    }
    async login(loginDto) {
        return this.staffService.login(loginDto);
    }
    async changePin(id, changePinDto) {
        return this.staffService.changePin(id, changePinDto);
    }
    async deactivate(id) {
        return this.staffService.deactivate(id);
    }
    async activate(id) {
        return this.staffService.activate(id);
    }
    async getActivity(id, limit) {
        return this.staffService.getStaffActivity(id, limit);
    }
    async getProfile(req) {
        const staffId = req.user.sub;
        return this.staffService.findOne(staffId);
    }
    async updateProfile(req, updateStaffDto) {
        const staffId = req.user.sub;
        return this.staffService.update(staffId, updateStaffDto);
    }
    async changeMyPin(req, changePinDto) {
        const staffId = req.user.sub;
        return this.staffService.changePin(staffId, changePinDto);
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new staff member' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff created successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_dto_1.CreateStaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of staff members' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff list retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant ID' }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, enum: staff_dto_1.StaffRole, description: 'Filter by staff role' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('merchantId')),
    __param(3, (0, common_1.Query)('role')),
    __param(4, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff statistics and analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff statistics retrieved successfully', type: staff_dto_1.StaffStatsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff member by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff retrieved successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff member by email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff retrieved successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff updated successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, staff_dto_1.UpdateStaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Staff login with email/PIN and PIN' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff logged in successfully', type: staff_dto_1.StaffLoginResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_dto_1.StaffLoginDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "login", null);
__decorate([
    (0, common_1.Post)(':id/change-pin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change staff PIN' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PIN changed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, staff_dto_1.ChangePinDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "changePin", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff deactivated successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Activate staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff activated successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "activate", null);
__decorate([
    (0, common_1.Get)(':id/activity'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff activity history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff activity retrieved successfully', type: [staff_dto_1.StaffActivityDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of activities to retrieve' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Get)('profile/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current staff profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff profile retrieved successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update current staff profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff profile updated successfully', type: staff_dto_1.StaffResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, staff_dto_1.UpdateStaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('profile/me/change-pin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change current staff PIN' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PIN changed successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, staff_dto_1.ChangePinDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "changeMyPin", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff Management'),
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map