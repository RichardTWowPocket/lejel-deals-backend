import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import {
  CouponResponseDto,
  CouponValidationDto,
  CouponValidationResponseDto,
  RedeemCouponDto,
  CancelCouponDto,
  CouponStatsDto,
  GenerateQRCodeDto,
} from './dto/coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import { UserRole, CouponStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all coupons with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: CouponStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'orderId', required: false, type: String, description: 'Filter by order ID' })
  @ApiQuery({ name: 'dealId', required: false, type: String, description: 'Filter by deal ID' })
  @ApiResponse({ status: 200, description: 'Coupons retrieved successfully' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: CouponStatus,
    @Query('orderId') orderId?: string,
    @Query('dealId') dealId?: string,
  ): Promise<{ coupons: CouponResponseDto[]; pagination: any }> {
    return this.couponsService.findAll(page, limit, status, orderId, dealId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupons for current authenticated customer' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: CouponStatus, description: 'Filter by status' })
  async findMine(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: CouponStatus,
  ): Promise<{ coupons: CouponResponseDto[]; pagination: any }> {
    return this.couponsService.findMine(user.id, Number(page) || 1, Number(limit) || 10, status);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupon statistics' })
  @ApiResponse({ status: 200, description: 'Coupon statistics retrieved successfully', type: CouponStatsDto })
  async getStats(): Promise<CouponStatsDto> {
    return this.couponsService.getStats();
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupons for a specific order' })
  @ApiResponse({ status: 200, description: 'Coupons retrieved successfully', type: [CouponResponseDto] })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findByOrder(@Param('orderId') orderId: string): Promise<CouponResponseDto[]> {
    return this.couponsService.findByOrder(orderId);
  }

  @Get('qr/:qrCode')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupon by QR code' })
  @ApiResponse({ status: 200, description: 'Coupon retrieved successfully', type: CouponResponseDto })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async findByQRCode(@Param('qrCode') qrCode: string): Promise<CouponResponseDto> {
    return this.couponsService.findByQRCode(qrCode);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiResponse({ status: 200, description: 'Coupon retrieved successfully', type: CouponResponseDto })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async findOne(@Param('id') id: string): Promise<CouponResponseDto> {
    return this.couponsService.findOne(id);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate a coupon QR code' })
  @ApiResponse({ status: 200, description: 'Coupon validation result', type: CouponValidationResponseDto })
  async validateCoupon(@Body() validationDto: CouponValidationDto): Promise<CouponValidationResponseDto> {
    return this.couponsService.validateCoupon(validationDto.qrCode);
  }

  @Post('redeem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redeem a coupon' })
  @ApiResponse({ status: 200, description: 'Coupon redeemed successfully', type: CouponResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid coupon or already used' })
  async redeemCoupon(@Body() redeemDto: RedeemCouponDto): Promise<CouponResponseDto> {
    return this.couponsService.redeemCoupon(redeemDto.qrCode, redeemDto.staffId, redeemDto.notes);
  }

  @Post('expire')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Expire all overdue coupons' })
  @ApiResponse({ status: 200, description: 'Coupons expired successfully' })
  async expireCoupons(): Promise<{ message: string; expiredCount: number }> {
    const expiredCount = await this.couponsService.expireCoupons();
    return {
      message: `${expiredCount} coupons expired successfully`,
      expiredCount,
    };
  }

  @Post('qr-code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate QR code for a coupon' })
  @ApiResponse({ status: 200, description: 'QR code generated successfully' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async generateQRCode(@Body() generateDto: GenerateQRCodeDto): Promise<{ qrCode: string }> {
    const qrCode = await this.couponsService.generateQRCodeData(generateDto.couponId);
    return { qrCode };
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a coupon' })
  @ApiResponse({ status: 200, description: 'Coupon cancelled successfully', type: CouponResponseDto })
  @ApiResponse({ status: 400, description: 'Coupon cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async cancelCoupon(
    @Param('id') id: string,
    @Body() cancelDto: CancelCouponDto,
  ): Promise<CouponResponseDto> {
    return this.couponsService.cancelCoupon(id, cancelDto.reason);
  }
}


