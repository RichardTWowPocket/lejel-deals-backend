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
exports.DealFiltersDto = exports.UpdateDealStatusDto = exports.UpdateDealDto = exports.CreateDealDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateDealDto {
    title;
    description;
    dealPrice;
    discountPrice;
    validFrom;
    validUntil;
    status;
    maxQuantity;
    images;
    terms;
    merchantId;
    categoryId;
}
exports.CreateDealDto = CreateDealDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal title', example: 'Pizza Voucher Rp 50.000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed description', example: 'Voucher senilai Rp 50.000 untuk semua menu pizza. Berlaku untuk makan di tempat dan dibawa pulang.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price customer pays to buy the coupon (IDR)', example: 40000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], CreateDealDto.prototype, "dealPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon face value in IDR', example: 50000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], CreateDealDto.prototype, "discountPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valid from date', example: '2024-01-01T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valid until date', example: '2024-12-31T23:59:59Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deal status', enum: client_1.DealStatus, default: client_1.DealStatus.DRAFT }),
    (0, class_validator_1.IsEnum)(client_1.DealStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum quantity available', example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDealDto.prototype, "maxQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of image URLs', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDealDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Terms and conditions' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID (UUID)', example: 'cm123456789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category ID (UUID)', example: 'cm987654321' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDealDto.prototype, "categoryId", void 0);
class UpdateDealDto {
    title;
    description;
    dealPrice;
    discountPrice;
    validFrom;
    validUntil;
    status;
    maxQuantity;
    images;
    terms;
    categoryId;
}
exports.UpdateDealDto = UpdateDealDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deal title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDealDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDealDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Price customer pays to buy the coupon (IDR)', example: 40000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], UpdateDealDto.prototype, "dealPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Coupon face value in IDR', example: 50000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], UpdateDealDto.prototype, "discountPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valid from date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDealDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valid until date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDealDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deal status', enum: client_1.DealStatus }),
    (0, class_validator_1.IsEnum)(client_1.DealStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDealDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum quantity available' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDealDto.prototype, "maxQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of image URLs', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDealDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Terms and conditions' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDealDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category ID (UUID)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDealDto.prototype, "categoryId", void 0);
class UpdateDealStatusDto {
    status;
}
exports.UpdateDealStatusDto = UpdateDealStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New status', enum: client_1.DealStatus }),
    (0, class_validator_1.IsEnum)(client_1.DealStatus),
    __metadata("design:type", String)
], UpdateDealStatusDto.prototype, "status", void 0);
class DealFiltersDto {
    page;
    limit;
    status;
    merchantId;
    categoryId;
    search;
    featured;
    sortBy;
    sortOrder;
    city;
    priceMin;
    priceMax;
}
exports.DealFiltersDto = DealFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DealFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 12 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DealFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status', enum: client_1.DealStatus }),
    (0, class_validator_1.IsEnum)(client_1.DealStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DealFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DealFiltersDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by category ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DealFiltersDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search term for title/description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DealFiltersDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter featured deals only', example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DealFiltersDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort by field', example: 'createdAt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DealFiltersDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order', enum: ['asc', 'desc'], example: 'desc' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DealFiltersDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant city', example: 'Jakarta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DealFiltersDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum deal price in IDR', example: 10000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DealFiltersDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum deal price in IDR', example: 100000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DealFiltersDto.prototype, "priceMax", void 0);
//# sourceMappingURL=create-deal.dto.js.map