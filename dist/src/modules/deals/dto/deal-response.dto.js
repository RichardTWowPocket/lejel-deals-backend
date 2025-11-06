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
exports.DealListResponseDto = exports.DealResponseDto = exports.DealCategoryDto = exports.DealMerchantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class DealMerchantDto {
    id;
    businessName;
    slug;
    logoUrl;
    address;
    city;
    province;
    phone;
}
exports.DealMerchantDto = DealMerchantDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DealMerchantDto.prototype, "phone", void 0);
class DealCategoryDto {
    id;
    name;
    slug;
    color;
}
exports.DealCategoryDto = DealCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealCategoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealCategoryDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DealCategoryDto.prototype, "color", void 0);
class DealResponseDto {
    id;
    slug;
    title;
    description;
    shortDescription;
    dealPrice;
    discountPrice;
    discountedPrice;
    originalPrice;
    discountPercentage;
    images;
    thumbnailUrl;
    validFrom;
    validUntil;
    redemptionDeadline;
    status;
    type;
    featured;
    maxQuantity;
    soldQuantity;
    quantity;
    quantityAvailable;
    terms;
    highlights;
    merchantId;
    merchant;
    categoryId;
    category;
    createdAt;
    updatedAt;
    _count;
}
exports.DealResponseDto = DealResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], DealResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], DealResponseDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price customer pays to buy the coupon (IDR)' }),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "dealPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coupon face value (IDR)' }),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "discountPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'For frontend compatibility - same as discountPrice',
    }),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "discountedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'For frontend compatibility - same as discountPrice',
    }),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "originalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Real calculated percentage discount' }),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], DealResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealResponseDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DealResponseDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DealResponseDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DealResponseDto.prototype, "redemptionDeadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DealStatus }),
    __metadata("design:type", String)
], DealResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], DealResponseDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], DealResponseDto.prototype, "maxQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "soldQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available quantity (maxQuantity - soldQuantity)',
    }),
    __metadata("design:type", Number)
], DealResponseDto.prototype, "quantityAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], DealResponseDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], DealResponseDto.prototype, "highlights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DealResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: DealMerchantDto }),
    __metadata("design:type", DealMerchantDto)
], DealResponseDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], DealResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: DealCategoryDto }),
    __metadata("design:type", DealCategoryDto)
], DealResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DealResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DealResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of orders for this deal' }),
    __metadata("design:type", Object)
], DealResponseDto.prototype, "_count", void 0);
class DealListResponseDto {
    deals;
    pagination;
}
exports.DealListResponseDto = DealListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DealResponseDto] }),
    __metadata("design:type", Array)
], DealListResponseDto.prototype, "deals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination metadata',
        example: {
            page: 1,
            limit: 12,
            total: 100,
            totalPages: 9,
        },
    }),
    __metadata("design:type", Object)
], DealListResponseDto.prototype, "pagination", void 0);
//# sourceMappingURL=deal-response.dto.js.map