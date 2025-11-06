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
exports.CreateCustomerDto = exports.NotificationPreferencesDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class NotificationPreferencesDto {
    email;
    sms;
    push;
    whatsapp;
    deals;
    orders;
    marketing;
}
exports.NotificationPreferencesDto = NotificationPreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email notifications enabled', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMS notifications enabled', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "sms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Push notifications enabled', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "push", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'WhatsApp notifications enabled',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal notifications enabled', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "deals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order notifications enabled', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Marketing notifications enabled',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "marketing", void 0);
class CreateCustomerDto {
    email;
    phone;
    firstName;
    lastName;
    dateOfBirth;
    preferences;
    isActive;
    metadata;
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer email',
        example: 'customer@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer phone number',
        example: '+6281234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'First name', example: 'John' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last name', example: 'Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of birth',
        example: '1990-01-01T00:00:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer preferences',
        type: NotificationPreferencesDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", NotificationPreferencesDto)
], CreateCustomerDto.prototype, "preferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is customer active', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCustomerDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata',
        example: { source: 'web', referrer: 'google' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCustomerDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-customer.dto.js.map