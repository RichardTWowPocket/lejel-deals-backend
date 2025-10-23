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
exports.CategoryTreeNodeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CategoryTreeNodeDto {
    id;
    name;
    description;
    icon;
    color;
    parentId;
    level;
    path;
    isActive;
    sortOrder;
    totalDeals;
    activeDeals;
    children;
}
exports.CategoryTreeNodeDto = CategoryTreeNodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category ID', example: 'category-123' }),
    __metadata("design:type", String)
], CategoryTreeNodeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name', example: 'Food & Beverage' }),
    __metadata("design:type", String)
], CategoryTreeNodeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category description', example: 'Restaurants, cafes, and food delivery' }),
    __metadata("design:type", String)
], CategoryTreeNodeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category icon', example: '🍽️' }),
    __metadata("design:type", String)
], CategoryTreeNodeDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category color', example: '#FF6B6B' }),
    __metadata("design:type", String)
], CategoryTreeNodeDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parent category ID', example: 'parent-category-123' }),
    __metadata("design:type", String)
], CategoryTreeNodeDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category level in tree', example: 1 }),
    __metadata("design:type", Number)
], CategoryTreeNodeDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category path', example: 'food/beverage' }),
    __metadata("design:type", String)
], CategoryTreeNodeDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is category active', example: true }),
    __metadata("design:type", Boolean)
], CategoryTreeNodeDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category sort order', example: 1 }),
    __metadata("design:type", Number)
], CategoryTreeNodeDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total deals count', example: 25 }),
    __metadata("design:type", Number)
], CategoryTreeNodeDto.prototype, "totalDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active deals count', example: 15 }),
    __metadata("design:type", Number)
], CategoryTreeNodeDto.prototype, "activeDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Child categories', type: [CategoryTreeNodeDto] }),
    __metadata("design:type", Array)
], CategoryTreeNodeDto.prototype, "children", void 0);
//# sourceMappingURL=category-tree.dto.js.map