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
exports.CategoryResponseDto = exports.CategoryHierarchyResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CategoryHierarchyResponseDto {
    parentId;
    level;
    path;
    parentName;
}
exports.CategoryHierarchyResponseDto = CategoryHierarchyResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent category ID',
        example: 'parent-category-123',
    }),
    __metadata("design:type", String)
], CategoryHierarchyResponseDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category level in hierarchy', example: 1 }),
    __metadata("design:type", Number)
], CategoryHierarchyResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category path in hierarchy',
        example: 'food/beverage',
    }),
    __metadata("design:type", String)
], CategoryHierarchyResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parent category name', example: 'Food' }),
    __metadata("design:type", String)
], CategoryHierarchyResponseDto.prototype, "parentName", void 0);
class CategoryResponseDto {
    id;
    name;
    description;
    icon;
    image;
    color;
    parentId;
    level;
    path;
    sortOrder;
    tags;
    metadata;
    isActive;
    createdAt;
    updatedAt;
    hierarchy;
    totalDeals;
    activeDeals;
    totalMerchants;
    childCategoriesCount;
    children;
}
exports.CategoryResponseDto = CategoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category ID', example: 'category-123' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name', example: 'Food & Beverage' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category description',
        example: 'Restaurants, cafes, and food delivery',
    }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category icon', example: '🍽️' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category image URL',
        example: 'https://example.com/category-image.jpg',
    }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category color for UI theming',
        example: '#FF6B6B',
    }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent category ID',
        example: 'parent-category-123',
    }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category level in hierarchy', example: 1 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category path in hierarchy',
        example: 'food/beverage',
    }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category sort order within level',
        example: 1,
    }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category tags',
        example: ['food', 'restaurant', 'delivery'],
    }),
    __metadata("design:type", Array)
], CategoryResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category metadata',
        example: { featured: true, priority: 1 },
    }),
    __metadata("design:type", Object)
], CategoryResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is category active', example: true }),
    __metadata("design:type", Boolean)
], CategoryResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category hierarchy information',
        type: CategoryHierarchyResponseDto,
    }),
    __metadata("design:type", CategoryHierarchyResponseDto)
], CategoryResponseDto.prototype, "hierarchy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total deals count', example: 25 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "totalDeals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Active deals count', example: 15 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "activeDeals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total merchants count', example: 8 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "totalMerchants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Child categories count', example: 3 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "childCategoriesCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Child categories',
        type: [CategoryResponseDto],
    }),
    __metadata("design:type", Array)
], CategoryResponseDto.prototype, "children", void 0);
//# sourceMappingURL=category-response.dto.js.map