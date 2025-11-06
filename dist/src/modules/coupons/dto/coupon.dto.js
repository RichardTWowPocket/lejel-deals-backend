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
exports.GenerateQRCodeDto = exports.CouponStatsDto = exports.CancelCouponDto = exports.RedeemCouponDto = exports.CouponValidationResponseDto = exports.CouponValidationDto = exports.CouponResponseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CouponResponseDto {
    id;
    orderId;
    dealId;
    qrCode;
    status;
    usedAt;
    expiresAt;
    createdAt;
    updatedAt;
    order;
    deal;
}
exports.CouponResponseDto = CouponResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon ID', example: 'coupon-123' }),
    __metadata("design:type", String)
], CouponResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID', example: 'order-123' }),
    __metadata("design:type", String)
], CouponResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal ID', example: 'deal-123' }),
    __metadata("design:type", String)
], CouponResponseDto.prototype, "dealId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'QR Code string', example: 'qr_code_string' }),
    __metadata("design:type", String)
], CouponResponseDto.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Coupon status',
        enum: client_1.CouponStatus,
        example: client_1.CouponStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], CouponResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Used date',
        example: '2024-01-01T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CouponResponseDto.prototype, "usedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration date',
        example: '2024-02-01T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CouponResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation date',
        example: '2024-01-01T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CouponResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2024-01-01T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CouponResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order details' }),
    __metadata("design:type", Object)
], CouponResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deal details' }),
    __metadata("design:type", Object)
], CouponResponseDto.prototype, "deal", void 0);
class CouponValidationDto {
    qrCode;
}
exports.CouponValidationDto = CouponValidationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'QR Code to validate',
        example: 'qr_code_string',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponValidationDto.prototype, "qrCode", void 0);
class CouponValidationResponseDto {
    isValid;
    coupon;
    error;
}
exports.CouponValidationResponseDto = CouponValidationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether coupon is valid', example: true }),
    __metadata("design:type", Boolean)
], CouponValidationResponseDto.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Coupon details if valid' }),
    __metadata("design:type", CouponResponseDto)
], CouponValidationResponseDto.prototype, "coupon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error message if invalid',
        example: 'Coupon has expired',
    }),
    __metadata("design:type", String)
], CouponValidationResponseDto.prototype, "error", void 0);
class RedeemCouponDto {
    qrCode;
    staffId;
    notes;
}
exports.RedeemCouponDto = RedeemCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'QR Code to redeem', example: 'qr_code_string' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemCouponDto.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff ID who redeemed the coupon',
        example: 'staff-123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemCouponDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Redemption notes',
        example: 'Redeemed at counter',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemCouponDto.prototype, "notes", void 0);
class CancelCouponDto {
    reason;
}
exports.CancelCouponDto = CancelCouponDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cancellation reason',
        example: 'Customer requested cancellation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelCouponDto.prototype, "reason", void 0);
class CouponStatsDto {
    totalCoupons;
    activeCoupons;
    usedCoupons;
    expiredCoupons;
    cancelledCoupons;
    totalRedemptions;
    redemptionRate;
}
exports.CouponStatsDto = CouponStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total coupons', example: 1000 }),
    __metadata("design:type", Number)
], CouponStatsDto.prototype, "totalCoupons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active coupons', example: 750 }),
    __metadata("design:type", Number)
], CouponStatsDto.prototype, "activeCoupons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Used coupons', example: 200 }),
    __metadata("design:type", Number)
], CouponStatsDto.prototype, "usedCoupons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expired coupons', example: 30 }),
    __metadata("design:type", Number)
], CouponStatsDto.prototype, "expiredCoupons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cancelled coupons', example: 20 }),
    __metadata("design:type", Number)
], CouponStatsDto.prototype, "cancelledCoupons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total redemptions', example: 200 }),
    __metadata("design:type", Number)
], CouponStatsDto.prototype, "totalRedemptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Redemption rate percentage', example: 20.0 }),
    __metadata("design:type", Number)
], CouponStatsDto.prototype, "redemptionRate", void 0);
class GenerateQRCodeDto {
    couponId;
}
exports.GenerateQRCodeDto = GenerateQRCodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon ID', example: 'coupon-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQRCodeDto.prototype, "couponId", void 0);
//# sourceMappingURL=coupon.dto.js.map