import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import type { AuthUser } from '../auth/types';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination and filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
    description: 'Filter by parent category ID',
  })
  @ApiQuery({
    name: 'level',
    required: false,
    description: 'Filter by hierarchy level',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated categories list',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('parentId') parentId?: string,
    @Query('level') level?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    const parentIdFilter = parentId === 'null' ? null : parentId;
    const levelFilter = level ? parseInt(level) : undefined;
    return this.categoriesService.findAll(
      page,
      limit,
      search,
      isActiveBool,
      parentIdFilter,
      levelFilter,
    );
  }

  @Public()
  @Get('tree')
  @ApiOperation({ summary: 'Get category tree structure' })
  @ApiResponse({ status: 200, description: 'Returns category tree' })
  getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Public()
  @Get('root')
  @ApiOperation({ summary: 'Get root categories only' })
  @ApiResponse({ status: 200, description: 'Returns root categories' })
  getRootCategories() {
    return this.categoriesService.getRootCategories();
  }

  @Public()
  @Get('level/:level')
  @ApiOperation({ summary: 'Get categories by hierarchy level' })
  @ApiParam({ name: 'level', description: 'Hierarchy level', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns categories at specified level',
  })
  getCategoriesByLevel(@Param('level', ParseIntPipe) level: number) {
    return this.categoriesService.getCategoriesByLevel(level);
  }

  @Public()
  @Get('all')
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({ status: 200, description: 'Returns all active categories' })
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search categories' })
  @ApiQuery({ name: 'q', description: 'Search query', example: 'food' })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
    description: 'Filter by parent category ID',
  })
  @ApiQuery({
    name: 'level',
    required: false,
    description: 'Filter by hierarchy level',
  })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  search(
    @Query('q') query: string,
    @Query('isActive') isActive?: string,
    @Query('parentId') parentId?: string,
    @Query('level') level?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    const parentIdFilter = parentId === 'null' ? null : parentId;
    const levelFilter = level ? parseInt(level) : undefined;
    return this.categoriesService.searchCategories(query, {
      isActive: isActiveBool,
      parentId: parentIdFilter,
      level: levelFilter,
    });
  }

  @Public()
  @Get('test')
  @ApiOperation({ summary: 'Test basic category query' })
  @ApiResponse({ status: 200, description: 'Returns test data' })
  async test() {
    try {
      const categories = await this.categoriesService[
        'prisma'
      ].category.findMany({
        take: 1,
      });
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Public()
  @Get('analytics')
  @ApiOperation({ summary: 'Get category analytics' })
  @ApiResponse({ status: 200, description: 'Returns category analytics' })
  getAnalytics() {
    return this.categoriesService.getCategoryAnalytics();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Returns the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Public()
  @Get('name/:name')
  @ApiOperation({ summary: 'Get category by name' })
  @ApiParam({ name: 'name', description: 'Category name' })
  @ApiResponse({ status: 200, description: 'Returns the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findByName(@Param('name') name: string) {
    return this.categoriesService.findByName(name);
  }

  @Public()
  @Get(':id/children')
  @ApiOperation({ summary: 'Get child categories' })
  @ApiParam({ name: 'id', description: 'Parent category ID' })
  @ApiResponse({ status: 200, description: 'Returns child categories' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getChildCategories(@Param('id') id: string) {
    return this.categoriesService.getChildCategories(id);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or circular reference',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category name already taken' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete category with child categories or active deals',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.categoriesService.remove(id);
  }

  // Category management
  @Roles('admin')
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Category activated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  activate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.categoriesService.activate(id);
  }

  @Roles('admin')
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Category deactivated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot deactivate category with active deals',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  deactivate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.categoriesService.deactivate(id);
  }

  @Roles('admin')
  @Post('reorder')
  @ApiOperation({ summary: 'Reorder categories' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Categories reordered successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  reorderCategories(
    @Body() categoryOrders: { id: string; sortOrder: number }[],
    @CurrentUser() user: AuthUser,
  ) {
    return this.categoriesService.reorderCategories(categoryOrders);
  }
}
