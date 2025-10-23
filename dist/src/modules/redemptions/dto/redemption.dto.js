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
exports.RedemptionFiltersDto = exports.RedemptionValidationDto = exports.RedemptionAnalyticsDto = exports.RedemptionStatsDto = exports.RedemptionResponseDto = exports.UpdateRedemptionDto = exports.CreateRedemptionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateRedemptionDto {
    qrToken;
    staffId;
    notes;
    location;
}
exports.CreateRedemptionDto = CreateRedemptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'QR code token to redeem', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRedemptionDto.prototype, "qrToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID performing the redemption', example: 'staff-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRedemptionDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption notes', example: 'Redeemed at counter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRedemptionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption location', example: 'Main Counter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRedemptionDto.prototype, "location", void 0);
class UpdateRedemptionDto {
    status;
    notes;
    location;
}
exports.UpdateRedemptionDto = UpdateRedemptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption status', enum: client_1.RedemptionStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RedemptionStatus),
    __metadata("design:type", String)
], UpdateRedemptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption notes', example: 'Updated notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRedemptionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption location', example: 'Main Counter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRedemptionDto.prototype, "location", void 0);
class RedemptionResponseDto {
    id;
    couponId;
    staffId;
    notes;
    location;
    status;
    redeemedAt;
    createdAt;
    updatedAt;
    metadata;
    coupon;
    order;
    deal;
    customer;
    merchant;
    staff;
}
exports.RedemptionResponseDto = RedemptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Redemption ID' }),
    __metadata("design:type", String)
], RedemptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon ID' }),
    __metadata("design:type", String)
], RedemptionResponseDto.prototype, "couponId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID' }),
    __metadata("design:type", String)
], RedemptionResponseDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption notes' }),
    __metadata("design:type", String)
], RedemptionResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption location' }),
    __metadata("design:type", String)
], RedemptionResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Redemption status', enum: client_1.RedemptionStatus }),
    __metadata("design:type", String)
], RedemptionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Redemption timestamp' }),
    __metadata("design:type", Date)
], RedemptionResponseDto.prototype, "redeemedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], RedemptionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], RedemptionResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redemption metadata' }),
    __metadata("design:type", Object)
], RedemptionResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon information' }),
    __metadata("design:type", Object)
], RedemptionResponseDto.prototype, "coupon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order information' }),
    __metadata("design:type", Object)
], RedemptionResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal information' }),
    __metadata("design:type", Object)
], RedemptionResponseDto.prototype, "deal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer information' }),
    __metadata("design:type", Object)
], RedemptionResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant information' }),
    __metadata("design:type", Object)
], RedemptionResponseDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff information' }),
    __metadata("design:type", Object)
], RedemptionResponseDto.prototype, "staff", void 0);
class RedemptionStatsDto {
    totalRedemptions;
    completedRedemptions;
    pendingRedemptions;
    cancelledRedemptions;
    completionRate;
    redemptionsByStaff;
    recentRedemptions;
    averageRedemptionTime;
    statusDistribution;
}
exports.RedemptionStatsDto = RedemptionStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total redemptions count' }),
    __metadata("design:type", Number)
], RedemptionStatsDto.prototype, "totalRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Completed redemptions count' }),
    __metadata("design:type", Number)
], RedemptionStatsDto.prototype, "completedRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pending redemptions count' }),
    __metadata("design:type", Number)
], RedemptionStatsDto.prototype, "pendingRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cancelled redemptions count' }),
    __metadata("design:type", Number)
], RedemptionStatsDto.prototype, "cancelledRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Completion rate percentage' }),
    __metadata("design:type", Number)
], RedemptionStatsDto.prototype, "completionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Redemptions by staff member' }),
    __metadata("design:type", Array)
], RedemptionStatsDto.prototype, "redemptionsByStaff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recent redemptions count (last 24 hours)' }),
    __metadata("design:type", Number)
], RedemptionStatsDto.prototype, "recentRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Average redemption time' }),
    __metadata("design:type", Date)
], RedemptionStatsDto.prototype, "averageRedemptionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status distribution' }),
    __metadata("design:type", Object)
], RedemptionStatsDto.prototype, "statusDistribution", void 0);
class RedemptionAnalyticsDto {
    dailyRedemptions;
    hourlyRedemptions;
    topPerformingStaff;
    redemptionTrends;
    customerRedemptions;
    summary;
}
exports.RedemptionAnalyticsDto = RedemptionAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Daily redemption statistics' }),
    __metadata("design:type", Array)
], RedemptionAnalyticsDto.prototype, "dailyRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hourly redemption statistics' }),
    __metadata("design:type", Array)
], RedemptionAnalyticsDto.prototype, "hourlyRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top performing staff members' }),
    __metadata("design:type", Array)
], RedemptionAnalyticsDto.prototype, "topPerformingStaff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Redemption trends over time' }),
    __metadata("design:type", Array)
], RedemptionAnalyticsDto.prototype, "redemptionTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer redemption statistics' }),
    __metadata("design:type", Array)
], RedemptionAnalyticsDto.prototype, "customerRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Analytics summary' }),
    __metadata("design:type", Object)
], RedemptionAnalyticsDto.prototype, "summary", void 0);
class RedemptionValidationDto {
    isValid;
    error;
    canRedeem;
    coupon;
    order;
    deal;
    customer;
    merchant;
    staff;
    validationTimestamp;
}
exports.RedemptionValidationDto = RedemptionValidationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the redemption is valid' }),
    __metadata("design:type", Boolean)
], RedemptionValidationDto.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error message if invalid' }),
    __metadata("design:type", String)
], RedemptionValidationDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the staff can redeem this coupon' }),
    __metadata("design:type", Boolean)
], RedemptionValidationDto.prototype, "canRedeem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Coupon information' }),
    __metadata("design:type", Object)
], RedemptionValidationDto.prototype, "coupon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order information' }),
    __metadata("design:type", Object)
], RedemptionValidationDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deal information' }),
    __metadata("design:type", Object)
], RedemptionValidationDto.prototype, "deal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer information' }),
    __metadata("design:type", Object)
], RedemptionValidationDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant information' }),
    __metadata("design:type", Object)
], RedemptionValidationDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff information' }),
    __metadata("design:type", Object)
], RedemptionValidationDto.prototype, "staff", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Validation timestamp' }),
    __metadata("design:type", Date)
], RedemptionValidationDto.prototype, "validationTimestamp", void 0);
class RedemptionFiltersDto {
    page;
    limit;
    merchantId;
    staffId;
    status;
    startDate;
    endDate;
}
exports.RedemptionFiltersDto = RedemptionFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1 }),
    __metadata("design:type", Number)
], RedemptionFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 10 }),
    __metadata("design:type", Number)
], RedemptionFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    __metadata("design:type", String)
], RedemptionFiltersDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by staff ID' }),
    __metadata("design:type", String)
], RedemptionFiltersDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by redemption status', enum: client_1.RedemptionStatus }),
    __metadata("design:type", String)
], RedemptionFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by start date', example: '2024-01-01' }),
    __metadata("design:type", Date)
], RedemptionFiltersDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by end date', example: '2024-12-31' }),
    __metadata("design:type", Date)
], RedemptionFiltersDto.prototype, "endDate", void 0);
//# sourceMappingURL=redemption.dto.js.map