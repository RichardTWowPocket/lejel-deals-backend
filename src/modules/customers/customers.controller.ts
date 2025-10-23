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
  DefaultValuePipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import type { AuthUser } from '../auth/types';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Roles('customer', 'admin')
  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or email already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  create(@Body() createCustomerDto: CreateCustomerDto, @CurrentUser() user: AuthUser) {
    return this.customersService.create(createCustomerDto, user.id);
  }

  @Public()
  @Post('create-from-supabase')
  @ApiOperation({ summary: 'Public: Create customer after Supabase signup (email verification flow)' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or email already exists' })
  createPublic(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto, 'public');
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'Returns paginated customers list' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    return this.customersService.findAll(page, limit, search, isActiveBool);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search customers' })
  @ApiQuery({ name: 'q', description: 'Search query', example: 'john' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  search(
    @Query('q') query: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    return this.customersService.searchCustomers(query, { isActive: isActiveBool });
  }

  @Public()
  @Get('top')
  @ApiOperation({ summary: 'Get top customers by spending' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of top customers', example: 10 })
  @ApiResponse({ status: 200, description: 'Returns top customers by spending' })
  getTopCustomers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.customersService.getTopCustomers(limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Returns the customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Public()
  @Get('email/:email')
  @ApiOperation({ summary: 'Get customer by email' })
  @ApiParam({ name: 'email', description: 'Customer email' })
  @ApiResponse({ status: 200, description: 'Returns the customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findByEmail(@Param('email') email: string) {
    return this.customersService.findByEmail(email);
  }

  @Roles('customer', 'admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or email already taken' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  update(
    @Param('id') id: string, 
    @Body() updateCustomerDto: UpdateCustomerDto, 
    @CurrentUser() user: AuthUser
  ) {
    return this.customersService.update(id, updateCustomerDto, user.id);
  }

  @Roles('customer', 'admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete customer with active orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.customersService.remove(id, user.id);
  }

  // Customer statistics and analytics
  @Roles('customer', 'admin')
  @Get(':id/stats')
  @ApiOperation({ summary: 'Get customer statistics' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns customer statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  getStats(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.customersService.getCustomerStats(id);
  }

  @Roles('customer', 'admin')
  @Get(':id/insights')
  @ApiOperation({ summary: 'Get customer insights and analytics' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns customer insights' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  getInsights(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.customersService.getCustomerInsights(id);
  }

  // Customer preferences management
  @Roles('customer', 'admin')
  @Patch(':id/preferences')
  @ApiOperation({ summary: 'Update customer notification preferences' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  updatePreferences(
    @Param('id') id: string,
    @Body() preferences: any,
    @CurrentUser() user: AuthUser
  ) {
    return this.customersService.updatePreferences(id, preferences, user.id);
  }

  @Public()
  @Get(':id/preferences')
  @ApiOperation({ summary: 'Get customer notification preferences' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Returns customer preferences' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  getPreferences(@Param('id') id: string) {
    return this.customersService.getPreferences(id);
  }

  // Customer activation/deactivation
  @Roles('customer', 'admin')
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Customer deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  deactivate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.customersService.deactivate(id, user.id);
  }

  @Roles('customer', 'admin')
  @Patch(':id/reactivate')
  @ApiOperation({ summary: 'Reactivate a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Customer reactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  reactivate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.customersService.reactivate(id, user.id);
  }
}
