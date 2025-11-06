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
exports.MerchantVerificationDto = exports.VerificationStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "PENDING";
    VerificationStatus["VERIFIED"] = "VERIFIED";
    VerificationStatus["REJECTED"] = "REJECTED";
    VerificationStatus["SUSPENDED"] = "SUSPENDED";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
class MerchantVerificationDto {
    status;
    notes;
    requiredDocuments;
    submittedDocuments;
    verifiedAt;
    verifiedBy;
}
exports.MerchantVerificationDto = MerchantVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification status',
        enum: VerificationStatus,
        example: VerificationStatus.PENDING,
    }),
    (0, class_validator_1.IsEnum)(VerificationStatus),
    __metadata("design:type", String)
], MerchantVerificationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification notes',
        example: 'Documents verified successfully',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantVerificationDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required documents',
        example: ['business_license', 'tax_id', 'bank_account'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MerchantVerificationDto.prototype, "requiredDocuments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Submitted documents',
        example: ['business_license.pdf', 'tax_id.pdf'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MerchantVerificationDto.prototype, "submittedDocuments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantVerificationDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verified by admin ID',
        example: 'admin-123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantVerificationDto.prototype, "verifiedBy", void 0);
//# sourceMappingURL=merchant-verification.dto.js.map