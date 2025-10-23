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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
let CategoriesController = class CategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(createCategoryDto, user) {
        return this.categoriesService.create(createCategoryDto);
    }
    findAll(page, limit, search, isActive, parentId, level) {
        const isActiveBool = isActive ? isActive === 'true' : undefined;
        const parentIdFilter = parentId === 'null' ? null : parentId;
        const levelFilter = level ? parseInt(level) : undefined;
        return this.categoriesService.findAll(page, limit, search, isActiveBool, parentIdFilter, levelFilter);
    }
    getCategoryTree() {
        return this.categoriesService.getCategoryTree();
    }
    getRootCategories() {
        return this.categoriesService.getRootCategories();
    }
    getCategoriesByLevel(level) {
        return this.categoriesService.getCategoriesByLevel(level);
    }
    getAllCategories() {
        return this.categoriesService.getAllCategories();
    }
    search(query, isActive, parentId, level) {
        const isActiveBool = isActive ? isActive === 'true' : undefined;
        const parentIdFilter = parentId === 'null' ? null : parentId;
        const levelFilter = level ? parseInt(level) : undefined;
        return this.categoriesService.searchCategories(query, {
            isActive: isActiveBool,
            parentId: parentIdFilter,
            level: levelFilter
        });
    }
    async test() {
        try {
            const categories = await this.categoriesService['prisma'].category.findMany({
                take: 1,
            });
            return { success: true, data: categories };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    getAnalytics() {
        return this.categoriesService.getCategoryAnalytics();
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    findByName(name) {
        return this.categoriesService.findByName(name);
    }
    getChildCategories(id) {
        return this.categoriesService.getChildCategories(id);
    }
    update(id, updateCategoryDto, user) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    remove(id, user) {
        return this.categoriesService.remove(id);
    }
    activate(id, user) {
        return this.categoriesService.activate(id);
    }
    deactivate(id, user) {
        return this.categoriesService.deactivate(id);
    }
    reorderCategories(categoryOrders, user) {
        return this.categoriesService.reorderCategories(categoryOrders);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Category name already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories with pagination and filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page', example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, description: 'Filter by active status' }),
    (0, swagger_1.ApiQuery)({ name: 'parentId', required: false, description: 'Filter by parent category ID' }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, description: 'Filter by hierarchy level' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated categories list' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('isActive')),
    __param(4, (0, common_1.Query)('parentId')),
    __param(5, (0, common_1.Query)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category tree structure' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns category tree' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "getCategoryTree", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('root'),
    (0, swagger_1.ApiOperation)({ summary: 'Get root categories only' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns root categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "getRootCategories", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('level/:level'),
    (0, swagger_1.ApiOperation)({ summary: 'Get categories by hierarchy level' }),
    (0, swagger_1.ApiParam)({ name: 'level', description: 'Hierarchy level', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns categories at specified level' }),
    __param(0, (0, common_1.Param)('level', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "getCategoriesByLevel", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all active categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "getAllCategories", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search categories' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Search query', example: 'food' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, description: 'Filter by active status' }),
    (0, swagger_1.ApiQuery)({ name: 'parentId', required: false, description: 'Filter by parent category ID' }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, description: 'Filter by hierarchy level' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns search results' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('parentId')),
    __param(3, (0, common_1.Query)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "search", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test basic category query' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns test data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "test", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns category analytics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "getAnalytics", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the category' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('name/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by name' }),
    (0, swagger_1.ApiParam)({ name: 'name', description: 'Category name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the category' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findByName", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)(':id/children'),
    (0, swagger_1.ApiOperation)({ summary: 'Get child categories' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Parent category ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns child categories' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "getChildCategories", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data or circular reference' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Category name already taken' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete category with child categories or active deals' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "remove", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a category' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category activated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "activate", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a category' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category ID' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot deactivate category with active deals' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "deactivate", null);
__decorate([
    (0, auth_decorators_1.Roles)('admin'),
    (0, common_1.Post)('reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder categories' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories reordered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin role required' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "reorderCategories", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map