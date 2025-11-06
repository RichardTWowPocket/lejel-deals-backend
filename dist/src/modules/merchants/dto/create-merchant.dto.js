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
exports.CreateMerchantDto = exports.OperatingHoursDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class OperatingHoursDto {
    day;
    openTime;
    closeTime;
    isOpen;
}
exports.OperatingHoursDto = OperatingHoursDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Day of the week', example: 'monday' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OperatingHoursDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Opening time', example: '09:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OperatingHoursDto.prototype, "openTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Closing time', example: '22:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OperatingHoursDto.prototype, "closeTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is open on this day', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], OperatingHoursDto.prototype, "isOpen", void 0);
class CreateMerchantDto {
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
}
exports.CreateMerchantDto = CreateMerchantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant name', example: 'Demo Restaurant' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant description',
        example: 'A sample restaurant for testing',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant email', example: 'demo@merchant.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant phone number',
        example: '+6281234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant address',
        example: 'Jl. Demo No. 123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City', example: 'Jakarta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Province', example: 'DKI Jakarta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal code', example: '12345' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Website URL',
        example: 'https://demo-restaurant.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Logo URL',
        example: 'https://via.placeholder.com/200x200',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant images URLs',
        example: ['https://via.placeholder.com/400x300'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMerchantDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operating hours',
        type: [OperatingHoursDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OperatingHoursDto),
    __metadata("design:type", Array)
], CreateMerchantDto.prototype, "operatingHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is merchant active', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMerchantDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-merchant.dto.js.map