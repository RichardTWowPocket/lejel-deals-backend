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
exports.StaffActivityDto = exports.ChangePinDto = exports.StaffStatsDto = exports.StaffLoginResponseDto = exports.StaffResponseDto = exports.StaffLoginDto = exports.UpdateStaffDto = exports.CreateStaffDto = exports.StaffRole = void 0;
exports.mapMerchantRoleToStaffRole = mapMerchantRoleToStaffRole;
exports.mapStaffRoleToMerchantRole = mapStaffRoleToMerchantRole;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
var StaffRole;
(function (StaffRole) {
    StaffRole["MANAGER"] = "MANAGER";
    StaffRole["CASHIER"] = "CASHIER";
    StaffRole["SUPERVISOR"] = "SUPERVISOR";
    StaffRole["ADMIN"] = "ADMIN";
})(StaffRole || (exports.StaffRole = StaffRole = {}));
function mapMerchantRoleToStaffRole(merchantRole) {
    const mapping = {
        [client_1.MerchantRole.OWNER]: StaffRole.ADMIN,
        [client_1.MerchantRole.ADMIN]: StaffRole.ADMIN,
        [client_1.MerchantRole.MANAGER]: StaffRole.MANAGER,
        [client_1.MerchantRole.SUPERVISOR]: StaffRole.SUPERVISOR,
        [client_1.MerchantRole.CASHIER]: StaffRole.CASHIER,
    };
    return mapping[merchantRole] || StaffRole.CASHIER;
}
function mapStaffRoleToMerchantRole(staffRole) {
    const mapping = {
        [StaffRole.ADMIN]: client_1.MerchantRole.ADMIN,
        [StaffRole.MANAGER]: client_1.MerchantRole.MANAGER,
        [StaffRole.SUPERVISOR]: client_1.MerchantRole.SUPERVISOR,
        [StaffRole.CASHIER]: client_1.MerchantRole.CASHIER,
    };
    return mapping[staffRole] || client_1.MerchantRole.CASHIER;
}
class CreateStaffDto {
    firstName;
    lastName;
    email;
    phone;
    pin;
    role;
    merchantId;
    permissions;
    metadata;
}
exports.CreateStaffDto = CreateStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff first name', example: 'John' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff last name', example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff email address', example: 'john.doe@merchant.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff phone number', example: '+6281234567890' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '4-6 digit PIN for authentication', example: '1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(6),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'PIN must contain only digits' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "pin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff role', enum: StaffRole, example: StaffRole.CASHIER }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(StaffRole),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID for staff assignment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff permissions object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateStaffDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional staff metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateStaffDto.prototype, "metadata", void 0);
class UpdateStaffDto {
    firstName;
    lastName;
    email;
    phone;
    pin;
    role;
    merchantId;
    permissions;
    metadata;
    isActive;
}
exports.UpdateStaffDto = UpdateStaffDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff first name', example: 'John' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff last name', example: 'Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff email address', example: 'john.doe@merchant.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff phone number', example: '+6281234567890' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '4-6 digit PIN for authentication', example: '1234' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(6),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'PIN must contain only digits' }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "pin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff role', enum: StaffRole }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(StaffRole),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID for staff assignment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff permissions object' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateStaffDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional staff metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateStaffDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStaffDto.prototype, "isActive", void 0);
class StaffLoginDto {
    identifier;
    pin;
}
exports.StaffLoginDto = StaffLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff email or PIN', example: 'john.doe@merchant.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffLoginDto.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff PIN', example: '1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(6),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'PIN must contain only digits' }),
    __metadata("design:type", String)
], StaffLoginDto.prototype, "pin", void 0);
class StaffResponseDto {
    id;
    firstName;
    lastName;
    email;
    phone;
    role;
    isActive;
    lastLoginAt;
    merchantId;
    merchant;
    permissions;
    metadata;
    createdAt;
    updatedAt;
}
exports.StaffResponseDto = StaffResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID (MerchantMembership ID)' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff first name' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff last name' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff email' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff phone' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff role', enum: StaffRole }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff active status' }),
    __metadata("design:type", Boolean)
], StaffResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last login timestamp' }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant information' }),
    __metadata("design:type", Object)
], StaffResponseDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff permissions' }),
    __metadata("design:type", Object)
], StaffResponseDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff metadata' }),
    __metadata("design:type", Object)
], StaffResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "updatedAt", void 0);
class StaffLoginResponseDto {
    staff;
    accessToken;
    expiresIn;
}
exports.StaffLoginResponseDto = StaffLoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff information' }),
    __metadata("design:type", StaffResponseDto)
], StaffLoginResponseDto.prototype, "staff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT access token' }),
    __metadata("design:type", String)
], StaffLoginResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token expiration time' }),
    __metadata("design:type", Number)
], StaffLoginResponseDto.prototype, "expiresIn", void 0);
class StaffStatsDto {
    totalStaff;
    activeStaff;
    staffByRole;
    staffByMerchant;
    recentLogins;
    activitySummary;
}
exports.StaffStatsDto = StaffStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total staff count' }),
    __metadata("design:type", Number)
], StaffStatsDto.prototype, "totalStaff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active staff count' }),
    __metadata("design:type", Number)
], StaffStatsDto.prototype, "activeStaff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff by role' }),
    __metadata("design:type", Object)
], StaffStatsDto.prototype, "staffByRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff by merchant' }),
    __metadata("design:type", Array)
], StaffStatsDto.prototype, "staffByMerchant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recent logins (last 24 hours)' }),
    __metadata("design:type", Number)
], StaffStatsDto.prototype, "recentLogins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff activity summary' }),
    __metadata("design:type", Object)
], StaffStatsDto.prototype, "activitySummary", void 0);
class ChangePinDto {
    currentPin;
    newPin;
}
exports.ChangePinDto = ChangePinDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current PIN', example: '1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(6),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'PIN must contain only digits' }),
    __metadata("design:type", String)
], ChangePinDto.prototype, "currentPin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New PIN', example: '5678' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(6),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'PIN must contain only digits' }),
    __metadata("design:type", String)
], ChangePinDto.prototype, "newPin", void 0);
class StaffActivityDto {
    activityType;
    description;
    entityId;
    metadata;
    timestamp;
}
exports.StaffActivityDto = StaffActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity type', example: 'REDEMPTION' }),
    __metadata("design:type", String)
], StaffActivityDto.prototype, "activityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity description', example: 'Redeemed coupon for order ORD-123' }),
    __metadata("design:type", String)
], StaffActivityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Related entity ID', example: 'coupon-123' }),
    __metadata("design:type", String)
], StaffActivityDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity metadata' }),
    __metadata("design:type", Object)
], StaffActivityDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity timestamp' }),
    __metadata("design:type", Date)
], StaffActivityDto.prototype, "timestamp", void 0);
//# sourceMappingURL=staff.dto.js.map