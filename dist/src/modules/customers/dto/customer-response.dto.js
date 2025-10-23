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
exports.CustomerResponseDto = exports.NotificationPreferencesResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class NotificationPreferencesResponseDto {
    email;
    sms;
    push;
    whatsapp;
    deals;
    orders;
    marketing;
}
exports.NotificationPreferencesResponseDto = NotificationPreferencesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email notifications enabled', example: true }),
    __metadata("design:type", Boolean)
], NotificationPreferencesResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMS notifications enabled', example: true }),
    __metadata("design:type", Boolean)
], NotificationPreferencesResponseDto.prototype, "sms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Push notifications enabled', example: true }),
    __metadata("design:type", Boolean)
], NotificationPreferencesResponseDto.prototype, "push", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'WhatsApp notifications enabled', example: false }),
    __metadata("design:type", Boolean)
], NotificationPreferencesResponseDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal notifications enabled', example: true }),
    __metadata("design:type", Boolean)
], NotificationPreferencesResponseDto.prototype, "deals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order notifications enabled', example: true }),
    __metadata("design:type", Boolean)
], NotificationPreferencesResponseDto.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Marketing notifications enabled', example: false }),
    __metadata("design:type", Boolean)
], NotificationPreferencesResponseDto.prototype, "marketing", void 0);
class CustomerResponseDto {
    id;
    email;
    phone;
    firstName;
    lastName;
    dateOfBirth;
    preferences;
    isActive;
    createdAt;
    updatedAt;
    totalOrders;
    totalSpent;
    lastOrderDate;
    favoriteCategories;
    tier;
    loyaltyPoints;
}
exports.CustomerResponseDto = CustomerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'customer-123' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer email', example: 'customer@example.com' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer phone number', example: '+6281234567890' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'First name', example: 'John' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last name', example: 'Doe' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth', example: '1990-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer preferences', type: NotificationPreferencesResponseDto }),
    __metadata("design:type", NotificationPreferencesResponseDto)
], CustomerResponseDto.prototype, "preferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is customer active', example: true }),
    __metadata("design:type", Boolean)
], CustomerResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total orders count', example: 25 }),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total spent amount', example: 2500000 }),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last order date', example: '2024-01-15T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "lastOrderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Favorite categories', example: ['Food & Beverage', 'Entertainment'] }),
    __metadata("design:type", Array)
], CustomerResponseDto.prototype, "favoriteCategories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer tier', example: 'Gold' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Loyalty points', example: 1500 }),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "loyaltyPoints", void 0);
//# sourceMappingURL=customer-response.dto.js.map