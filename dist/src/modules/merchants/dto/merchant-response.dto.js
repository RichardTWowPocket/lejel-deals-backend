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
exports.MerchantResponseDto = exports.OperatingHoursResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OperatingHoursResponseDto {
    day;
    openTime;
    closeTime;
    isOpen;
}
exports.OperatingHoursResponseDto = OperatingHoursResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Day of the week', example: 'monday' }),
    __metadata("design:type", String)
], OperatingHoursResponseDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Opening time', example: '09:00' }),
    __metadata("design:type", String)
], OperatingHoursResponseDto.prototype, "openTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Closing time', example: '22:00' }),
    __metadata("design:type", String)
], OperatingHoursResponseDto.prototype, "closeTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is open on this day', example: true }),
    __metadata("design:type", Boolean)
], OperatingHoursResponseDto.prototype, "isOpen", void 0);
class MerchantResponseDto {
    id;
    name;
    description;
    email;
    phone;
    address;
    city;
    province;
    postalCode;
    website;
    logo;
    images;
    operatingHours;
    isActive;
    createdAt;
    updatedAt;
    totalDeals;
    activeDeals;
    totalOrders;
}
exports.MerchantResponseDto = MerchantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID', example: 'merchant-123' }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant name', example: 'Demo Restaurant' }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant description',
        example: 'A sample restaurant for testing',
    }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant email', example: 'demo@merchant.com' }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant phone number',
        example: '+6281234567890',
    }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant address',
        example: 'Jl. Demo No. 123',
    }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City', example: 'Jakarta' }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Province', example: 'DKI Jakarta' }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal code', example: '12345' }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Website URL',
        example: 'https://demo-restaurant.com',
    }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Logo URL',
        example: 'https://via.placeholder.com/200x200',
    }),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Merchant images URLs',
        example: ['https://via.placeholder.com/400x300'],
    }),
    __metadata("design:type", Array)
], MerchantResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operating hours',
        type: [OperatingHoursResponseDto],
    }),
    __metadata("design:type", Array)
], MerchantResponseDto.prototype, "operatingHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is merchant active', example: true }),
    __metadata("design:type", Boolean)
], MerchantResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], MerchantResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], MerchantResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total deals count', example: 15 }),
    __metadata("design:type", Number)
], MerchantResponseDto.prototype, "totalDeals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Active deals count', example: 8 }),
    __metadata("design:type", Number)
], MerchantResponseDto.prototype, "activeDeals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total orders count', example: 1250 }),
    __metadata("design:type", Number)
], MerchantResponseDto.prototype, "totalOrders", void 0);
//# sourceMappingURL=merchant-response.dto.js.map