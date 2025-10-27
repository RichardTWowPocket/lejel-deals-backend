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
  ParseBoolPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { MerchantVerificationDto } from './dto/merchant-verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import type { AuthUser } from '../auth/types';

@ApiTags('Merchants')
@Controller('merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Roles('merchant', 'admin')
  @Post()
  @ApiOperation({ summary: 'Create a new merchant' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Merchant created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or email already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  create(@Body() createMerchantDto: CreateMerchantDto, @CurrentUser() user: AuthUser) {
    return this.merchantsService.create(createMerchantDto, user.id);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all merchants with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'Returns paginated merchants list' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    return this.merchantsService.findAll(page, limit, search, city, isActiveBool);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search merchants' })
  @ApiQuery({ name: 'q', description: 'Search query', example: 'restaurant' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  search(
    @Query('q') query: string,
    @Query('city') city?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    return this.merchantsService.searchMerchants(query, { city, isActive: isActiveBool });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiResponse({ status: 200, description: 'Returns the merchant' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  findOne(@Param('id') id: string) {
    return this.merchantsService.findOne(id);
  }

  @Public()
  @Get('email/:email')
  @ApiOperation({ summary: 'Get merchant by email' })
  @ApiParam({ name: 'email', description: 'Merchant email' })
  @ApiResponse({ status: 200, description: 'Returns the merchant' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  findByEmail(@Param('email') email: string) {
    return this.merchantsService.findByEmail(email);
  }

  @Roles('merchant', 'admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a merchant' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Merchant updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or email already taken' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  update(
    @Param('id') id: string, 
    @Body() updateMerchantDto: UpdateMerchantDto, 
    @CurrentUser() user: AuthUser
  ) {
    return this.merchantsService.update(id, updateMerchantDto, user.id);
  }

  @Roles('merchant', 'admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a merchant' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Merchant deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete merchant with active deals' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.merchantsService.remove(id, user.id);
  }

  // Merchant verification endpoints
  @Roles('admin')
  @Patch(':id/verification')
  @ApiOperation({ summary: 'Update merchant verification status' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Verification status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  updateVerification(
    @Param('id') id: string,
    @Body() verificationDto: MerchantVerificationDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.merchantsService.updateVerificationStatus(id, verificationDto, user.id);
  }

  @Public()
  @Get(':id/verification')
  @ApiOperation({ summary: 'Get merchant verification status' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiResponse({ status: 200, description: 'Returns verification status' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  getVerificationStatus(@Param('id') id: string) {
    return this.merchantsService.getVerificationStatus(id);
  }

  // Operating hours management
  @Roles('merchant', 'admin')
  @Patch(':id/operating-hours')
  @ApiOperation({ summary: 'Update merchant operating hours' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Operating hours updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  updateOperatingHours(
    @Param('id') id: string,
    @Body() operatingHours: any[],
    @CurrentUser() user: AuthUser
  ) {
    return this.merchantsService.updateOperatingHours(id, operatingHours, user.id);
  }

  @Public()
  @Get(':id/operating-hours')
  @ApiOperation({ summary: 'Get merchant operating hours' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiResponse({ status: 200, description: 'Returns operating hours' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  getOperatingHours(@Param('id') id: string) {
    return this.merchantsService.getOperatingHours(id);
  }

  // Statistics and analytics
  @Roles('merchant', 'admin')
  @Get(':id/stats')
  @ApiOperation({ summary: 'Get merchant statistics' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns merchant statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  getStats(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.merchantsService.getMerchantStats(id);
  }

  // Merchant overview for dashboard
  @Roles('merchant', 'admin')
  @Get(':id/overview')
  @ApiOperation({ summary: 'Get merchant overview - today\'s metrics for dashboard' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns merchant overview with today\'s KPIs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  getOverview(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.merchantsService.getMerchantOverview(id);
  }

  // Payouts endpoint
  @Roles('merchant', 'admin')
  @Get(':id/payouts')
  @ApiOperation({ summary: 'Get merchant payouts and revenue calculations' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiQuery({ name: 'period', required: false, enum: ['day', 'week', 'month', 'year', 'all'], description: 'Time period for payouts' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns merchant payouts and revenue data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  getPayouts(
    @Param('id') id: string,
    @Query('period') period?: 'day' | 'week' | 'month' | 'year' | 'all',
    @CurrentUser() user?: AuthUser,
  ) {
    return this.merchantsService.getMerchantPayouts(id, period || 'all');
  }

  // Merchant activation/deactivation
  @Roles('merchant', 'admin')
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a merchant' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Merchant deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  deactivate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.merchantsService.deactivate(id, user.id);
  }

  @Roles('merchant', 'admin')
  @Patch(':id/reactivate')
  @ApiOperation({ summary: 'Reactivate a merchant' })
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Merchant reactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  reactivate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.merchantsService.reactivate(id, user.id);
  }
}
