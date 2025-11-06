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
exports.QRCodeHistoryDto = exports.QRCodeStatsDto = exports.QRCodeActivityDto = exports.QRCodeValidationResponseDto = exports.QRCodeResponseDto = exports.RevokeQRCodeDto = exports.RedeemQRCodeDto = exports.ValidateQRCodeDto = exports.GenerateQRCodeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateQRCodeDto {
    couponId;
}
exports.GenerateQRCodeDto = GenerateQRCodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Coupon ID to generate QR code for',
        example: 'coupon-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQRCodeDto.prototype, "couponId", void 0);
class ValidateQRCodeDto {
    qrToken;
    staffId;
}
exports.ValidateQRCodeDto = ValidateQRCodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'QR code token to validate',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateQRCodeDto.prototype, "qrToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff ID performing the validation',
        example: 'staff-123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateQRCodeDto.prototype, "staffId", void 0);
class RedeemQRCodeDto {
    qrToken;
    staffId;
    notes;
}
exports.RedeemQRCodeDto = RedeemQRCodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'QR code token to redeem',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemQRCodeDto.prototype, "qrToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff ID performing the redemption',
        example: 'staff-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemQRCodeDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Redemption notes',
        example: 'Redeemed at counter',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemQRCodeDto.prototype, "notes", void 0);
class RevokeQRCodeDto {
    couponId;
    reason;
}
exports.RevokeQRCodeDto = RevokeQRCodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon ID to revoke', example: 'coupon-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeQRCodeDto.prototype, "couponId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for revocation',
        example: 'Customer requested cancellation',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeQRCodeDto.prototype, "reason", void 0);
class QRCodeResponseDto {
    qrToken;
    expiresAt;
    issuedAt;
    coupon;
    order;
    deal;
    customer;
    merchant;
}
exports.QRCodeResponseDto = QRCodeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Generated QR code token' }),
    __metadata("design:type", String)
], QRCodeResponseDto.prototype, "qrToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'QR code expiration timestamp' }),
    __metadata("design:type", Date)
], QRCodeResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'QR code issued timestamp' }),
    __metadata("design:type", Date)
], QRCodeResponseDto.prototype, "issuedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon information' }),
    __metadata("design:type", Object)
], QRCodeResponseDto.prototype, "coupon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order information' }),
    __metadata("design:type", Object)
], QRCodeResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal information' }),
    __metadata("design:type", Object)
], QRCodeResponseDto.prototype, "deal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer information' }),
    __metadata("design:type", Object)
], QRCodeResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant information' }),
    __metadata("design:type", Object)
], QRCodeResponseDto.prototype, "merchant", void 0);
class QRCodeValidationResponseDto {
    isValid;
    error;
    payload;
    coupon;
    order;
    deal;
    customer;
    merchant;
}
exports.QRCodeValidationResponseDto = QRCodeValidationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the QR code is valid' }),
    __metadata("design:type", Boolean)
], QRCodeValidationResponseDto.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error message if invalid' }),
    __metadata("design:type", String)
], QRCodeValidationResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'QR code payload' }),
    __metadata("design:type", Object)
], QRCodeValidationResponseDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Coupon information' }),
    __metadata("design:type", Object)
], QRCodeValidationResponseDto.prototype, "coupon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order information' }),
    __metadata("design:type", Object)
], QRCodeValidationResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deal information' }),
    __metadata("design:type", Object)
], QRCodeValidationResponseDto.prototype, "deal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer information' }),
    __metadata("design:type", Object)
], QRCodeValidationResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant information' }),
    __metadata("design:type", Object)
], QRCodeValidationResponseDto.prototype, "merchant", void 0);
class QRCodeActivityDto {
    id;
    action;
    couponId;
    metadata;
    timestamp;
    createdAt;
}
exports.QRCodeActivityDto = QRCodeActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity ID' }),
    __metadata("design:type", String)
], QRCodeActivityDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity action', example: 'GENERATED' }),
    __metadata("design:type", String)
], QRCodeActivityDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Coupon ID' }),
    __metadata("design:type", String)
], QRCodeActivityDto.prototype, "couponId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Activity metadata' }),
    __metadata("design:type", Object)
], QRCodeActivityDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity timestamp' }),
    __metadata("design:type", Date)
], QRCodeActivityDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], QRCodeActivityDto.prototype, "createdAt", void 0);
class QRCodeStatsDto {
    totalGenerated;
    totalValidated;
    totalRedeemed;
    totalExpired;
    totalRevoked;
    recentActivity;
    successRate;
    expirationRate;
}
exports.QRCodeStatsDto = QRCodeStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total QR codes generated' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "totalGenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total QR codes validated' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "totalValidated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total QR codes redeemed' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "totalRedeemed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total QR codes expired' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "totalExpired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total QR codes revoked' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "totalRevoked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recent activity count (last 24 hours)' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "recentActivity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Success rate percentage' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "successRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expiration rate percentage' }),
    __metadata("design:type", Number)
], QRCodeStatsDto.prototype, "expirationRate", void 0);
class QRCodeHistoryDto {
    activities;
    total;
}
exports.QRCodeHistoryDto = QRCodeHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'QR code activities', type: [QRCodeActivityDto] }),
    __metadata("design:type", Array)
], QRCodeHistoryDto.prototype, "activities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total activities count' }),
    __metadata("design:type", Number)
], QRCodeHistoryDto.prototype, "total", void 0);
//# sourceMappingURL=qr-security.dto.js.map