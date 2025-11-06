import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RedemptionService } from './redemptions.service';
import {
  CreateRedemptionDto,
  UpdateRedemptionDto,
  RedemptionResponseDto,
  RedemptionStatsDto,
  RedemptionAnalyticsDto,
  RedemptionValidationDto,
  RedemptionFiltersDto,
} from './dto/redemption.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { UserRole, RedemptionStatus } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Redemptions')
@Controller('redemptions')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @Post('process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a redemption with QR code validation' })
  @ApiResponse({
    status: 201,
    description: 'Redemption processed successfully',
    type: RedemptionResponseDto,
  })
  async processRedemption(
    @Body() createRedemptionDto: CreateRedemptionDto,
  ): Promise<RedemptionResponseDto> {
    return this.redemptionService.processRedemption(
      createRedemptionDto.qrToken,
      createRedemptionDto.redeemedByUserId,
      createRedemptionDto.notes,
      createRedemptionDto.location,
    );
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate redemption before processing' })
  @ApiResponse({
    status: 200,
    description: 'Redemption validation result',
    type: RedemptionValidationDto,
  })
  async validateRedemption(
    @Body() body: { qrToken: string; redeemedByUserId: string },
  ): Promise<RedemptionValidationDto> {
    return this.redemptionService.validateRedemption(
      body.qrToken,
      body.redeemedByUserId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated list of redemptions with filtering' })
  @ApiResponse({
    status: 200,
    description: 'Redemptions retrieved successfully',
  })
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
    name: 'merchantId',
    required: false,
    type: String,
    description: 'Filter by merchant ID',
  })
  @ApiQuery({
    name: 'redeemedByUserId',
    required: false,
    type: String,
    description: 'Filter by user ID who redeemed',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RedemptionStatus,
    description: 'Filter by redemption status',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Filter by start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Filter by end date',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('merchantId') merchantId?: string,
    @Query('redeemedByUserId') redeemedByUserId?: string,
    @Query('status') status?: RedemptionStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<{ redemptions: RedemptionResponseDto[]; pagination: any }> {
    return this.redemptionService.findAll(
      page,
      limit,
      merchantId,
      redeemedByUserId,
      status,
      startDate,
      endDate,
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get redemption statistics' })
  @ApiResponse({
    status: 200,
    description: 'Redemption statistics retrieved successfully',
    type: RedemptionStatsDto,
  })
  @ApiQuery({
    name: 'merchantId',
    required: false,
    type: String,
    description: 'Filter by merchant ID',
  })
  async getRedemptionStats(
    @Query('merchantId') merchantId?: string,
  ): Promise<RedemptionStatsDto> {
    return this.redemptionService.getRedemptionStats(merchantId);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get redemption analytics and insights' })
  @ApiResponse({
    status: 200,
    description: 'Redemption analytics retrieved successfully',
    type: RedemptionAnalyticsDto,
  })
  @ApiQuery({
    name: 'merchantId',
    required: false,
    type: String,
    description: 'Filter by merchant ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Filter by start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Filter by end date',
  })
  async getRedemptionAnalytics(
    @Query('merchantId') merchantId?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<RedemptionAnalyticsDto> {
    return this.redemptionService.getRedemptionAnalytics(
      merchantId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get redemption by ID' })
  @ApiResponse({
    status: 200,
    description: 'Redemption retrieved successfully',
    type: RedemptionResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<RedemptionResponseDto> {
    return this.redemptionService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update redemption status' })
  @ApiResponse({
    status: 200,
    description: 'Redemption status updated successfully',
    type: RedemptionResponseDto,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: RedemptionStatus; notes?: string },
  ): Promise<RedemptionResponseDto> {
    return this.redemptionService.updateStatus(id, body.status, body.notes);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get redemptions by user' })
  @ApiResponse({
    status: 200,
    description: 'User redemptions retrieved successfully',
  })
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
    enum: RedemptionStatus,
    description: 'Filter by redemption status',
  })
  async getStaffRedemptions(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: RedemptionStatus,
  ): Promise<{ redemptions: RedemptionResponseDto[]; pagination: any }> {
    return this.redemptionService.findAll(
      page,
      limit,
      undefined,
      userId,
      status,
    );
  }

  @Get('merchant/:merchantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get redemptions by merchant' })
  @ApiResponse({
    status: 200,
    description: 'Merchant redemptions retrieved successfully',
  })
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
    enum: RedemptionStatus,
    description: 'Filter by redemption status',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Filter by start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Filter by end date',
  })
  async getMerchantRedemptions(
    @Param('merchantId') merchantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: RedemptionStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<{ redemptions: RedemptionResponseDto[]; pagination: any }> {
    return this.redemptionService.findAll(
      page,
      limit,
      merchantId,
      undefined,
      status,
      startDate,
      endDate,
    );
  }

  @Get('customer/:customerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get redemptions by customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer redemptions retrieved successfully',
  })
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
    enum: RedemptionStatus,
    description: 'Filter by redemption status',
  })
  async getCustomerRedemptions(
    @Param('customerId') customerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: RedemptionStatus,
  ): Promise<{ redemptions: RedemptionResponseDto[]; pagination: any }> {
    // This would need to be implemented to filter by customer through the order relationship
    return this.redemptionService.findAll(
      page,
      limit,
      undefined,
      undefined,
      status,
    );
  }

  @Get('health')
  @ApiOperation({ summary: 'Redemption service health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck(): Promise<{
    status: string;
    timestamp: Date;
    service: string;
  }> {
    return {
      status: 'healthy',
      timestamp: new Date(),
      service: 'Redemption Service',
    };
  }
}
