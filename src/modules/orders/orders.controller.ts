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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import { UserRole, OrderStatus } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 404, description: 'Customer or deal not found' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get all orders with pagination and filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter by order status',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: String,
    description: 'Filter by customer ID',
  })
  @ApiQuery({
    name: 'dealId',
    required: false,
    type: String,
    description: 'Filter by deal ID',
  })
  @ApiQuery({
    name: 'merchantId',
    required: false,
    type: String,
    description: 'Filter by merchant ID',
  })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: OrderStatus,
    @Query('customerId') customerId?: string,
    @Query('dealId') dealId?: string,
    @Query('merchantId') merchantId?: string,
  ) {
    return this.ordersService.findAll(
      page,
      limit,
      status,
      customerId,
      dealId,
      merchantId,
    );
  }

  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({
    status: 200,
    description: 'Order statistics retrieved successfully',
  })
  async getStats() {
    return this.ordersService.getStats();
  }

  @Get('analytics')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get order analytics' })
  @ApiQuery({
    name: 'period',
    required: false,
    type: String,
    description: 'Analytics period (week, month, year)',
  })
  @ApiResponse({
    status: 200,
    description: 'Order analytics retrieved successfully',
  })
  async getAnalytics(@Query('period') period?: string) {
    return this.ordersService.getAnalytics(period);
  }

  @Get('customer/:customerId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get orders for a specific customer' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer orders retrieved successfully',
  })
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findByCustomer(customerId, page, limit);
  }

  @Get('me')
  @Roles(UserRole.CUSTOMER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get orders for current authenticated customer' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Current customer orders retrieved successfully',
  })
  async findMine(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findMine(user.id, page, limit);
  }

  @Get('merchant/:merchantId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get orders for a specific merchant' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Merchant orders retrieved successfully',
  })
  async findByMerchant(
    @Param('merchantId') merchantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findByMerchant(merchantId, page, limit);
  }

  @Get('number/:orderNumber')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get order by order number' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Order cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.ordersService.cancel(id, reason);
  }

  @Patch(':id/refund')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiOperation({ summary: 'Refund order' })
  @ApiResponse({ status: 200, description: 'Order refunded successfully' })
  @ApiResponse({ status: 400, description: 'Order cannot be refunded' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async refund(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.ordersService.refund(id, reason);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 400, description: 'Order cannot be deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return { message: 'Order deleted successfully' };
  }
}
