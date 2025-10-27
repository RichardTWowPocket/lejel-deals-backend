import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto, UpdateDealStatusDto, DealFiltersDto } from './dto/create-deal.dto';
import { DealResponseDto, DealListResponseDto } from './dto/deal-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser, Public } from '../auth/decorators/auth.decorators';
import { UserRole, DealStatus } from '@prisma/client';

@ApiTags('Deals')
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all deals with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: DealStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in title/description' })
  @ApiQuery({ name: 'featured', required: false, type: Boolean, description: 'Filter featured deals' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter by merchant city' })
  @ApiQuery({ name: 'priceMin', required: false, type: Number, description: 'Minimum deal price (IDR)' })
  @ApiQuery({ name: 'priceMax', required: false, type: Number, description: 'Maximum deal price (IDR)' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Deals retrieved successfully', type: DealListResponseDto })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    @Query('status') status?: DealStatus,
    @Query('merchantId') merchantId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: boolean,
    @Query('city') city?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<DealListResponseDto> {
    return this.dealsService.findAll({
      page,
      limit,
      status,
      merchantId,
      categoryId,
      search,
      featured,
      city,
      priceMin,
      priceMax,
      sortBy,
      sortOrder,
    });
  }

  @Public()
  @Get('active')
  @ApiOperation({ summary: 'Get all active deals' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Active deals retrieved successfully' })
  async findActive(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<DealListResponseDto> {
    return this.dealsService.findActive(page, limit);
  }

  @Public()
  @Get('status/:status')
  @ApiOperation({ summary: 'Get deals by status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Deals retrieved successfully' })
  async findByStatus(
    @Param('status') status: DealStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<DealListResponseDto> {
    return this.dealsService.findByStatus(status, page, limit);
  }

  @Public()
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get deals by merchant' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Merchant deals retrieved successfully' })
  async findByMerchant(
    @Param('merchantId') merchantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<DealListResponseDto> {
    return this.dealsService.findByMerchant(merchantId, page, limit);
  }

  @Public()
  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get deals by category' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Category deals retrieved successfully' })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<DealListResponseDto> {
    return this.dealsService.findByCategory(categoryId, page, limit);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get deal statistics' })
  @ApiResponse({ status: 200, description: 'Deal statistics retrieved successfully' })
  async getStats() {
    return this.dealsService.getStats();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID or slug' })
  @ApiResponse({ status: 200, description: 'Deal retrieved successfully', type: DealResponseDto })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async findOne(@Param('id') id: string): Promise<DealResponseDto> {
    // Try to find by ID first, if fails, try by slug
    try {
      return await this.dealsService.findOne(id);
    } catch (error) {
      // If not found by ID, try by slug
      return await this.dealsService.findBySlug(id);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new deal' })
  @ApiResponse({ status: 201, description: 'Deal created successfully', type: DealResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid deal data' })
  @ApiResponse({ status: 404, description: 'Merchant or category not found' })
  async create(
    @Body() createDealDto: CreateDealDto,
    @CurrentUser() user: any,
  ): Promise<DealResponseDto> {
    return this.dealsService.create(createDealDto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update deal' })
  @ApiResponse({ status: 200, description: 'Deal updated successfully', type: DealResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDealDto: UpdateDealDto,
    @CurrentUser() user: any,
  ): Promise<DealResponseDto> {
    return this.dealsService.update(id, updateDealDto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.ADMIN)
  @Patch(':id/status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update deal status' })
  @ApiResponse({ status: 200, description: 'Deal status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDealStatusDto,
    @CurrentUser() user: any,
  ): Promise<DealResponseDto> {
    return this.dealsService.updateStatus(id, updateStatusDto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.ADMIN)
  @Post(':id/publish')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Publish deal (DRAFT -> ACTIVE)' })
  @ApiResponse({ status: 200, description: 'Deal published successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async publish(@Param('id') id: string, @CurrentUser() user: any): Promise<DealResponseDto> {
    return this.dealsService.publish(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.ADMIN)
  @Post(':id/pause')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Pause deal (ACTIVE -> PAUSED)' })
  @ApiResponse({ status: 200, description: 'Deal paused successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async pause(@Param('id') id: string, @CurrentUser() user: any): Promise<DealResponseDto> {
    return this.dealsService.pause(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('expired/check')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check and update expired deals (Admin only)' })
  @ApiResponse({ status: 200, description: 'Expired deals updated' })
  async checkExpiredDeals() {
    return this.dealsService.checkExpiredDeals();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('sold-out/check')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check and update sold out deals (Admin only)' })
  @ApiResponse({ status: 200, description: 'Sold out deals updated' })
  async checkSoldOutDeals() {
    return this.dealsService.checkSoldOutDeals();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete deal (Admin only - soft delete)' })
  @ApiResponse({ status: 204, description: 'Deal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
    await this.dealsService.remove(id, user.id);
  }
}

