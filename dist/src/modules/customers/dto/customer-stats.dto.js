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
exports.CustomerStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CustomerStatsDto {
    customerId;
    totalOrders;
    totalSpent;
    averageOrderValue;
    lastOrderDate;
    firstOrderDate;
    activeDeals;
    usedDeals;
    favoriteCategories;
    tier;
    loyaltyPoints;
    registrationDate;
    daysSinceLastOrder;
    totalSavings;
}
exports.CustomerStatsDto = CustomerStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'customer-123' }),
    __metadata("design:type", String)
], CustomerStatsDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders count', example: 25 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total spent amount', example: 2500000 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average order value', example: 100000 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "averageOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last order date',
        example: '2024-01-15T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CustomerStatsDto.prototype, "lastOrderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'First order date',
        example: '2023-06-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CustomerStatsDto.prototype, "firstOrderDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active deals count', example: 3 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "activeDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Used deals count', example: 22 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "usedDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Favorite categories',
        example: ['Food & Beverage', 'Entertainment'],
    }),
    __metadata("design:type", Array)
], CustomerStatsDto.prototype, "favoriteCategories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer tier', example: 'Gold' }),
    __metadata("design:type", String)
], CustomerStatsDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Loyalty points', example: 1500 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "loyaltyPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Registration date',
        example: '2023-06-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CustomerStatsDto.prototype, "registrationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Days since last order', example: 5 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "daysSinceLastOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total savings from deals', example: 500000 }),
    __metadata("design:type", Number)
], CustomerStatsDto.prototype, "totalSavings", void 0);
//# sourceMappingURL=customer-stats.dto.js.map