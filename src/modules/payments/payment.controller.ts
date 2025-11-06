import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  PaymentResponseDto,
  PaymentStatusDto,
  WebhookPayloadDto,
  CancelPaymentDto,
} from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment for an order' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get(':orderId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status for an order' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
    type: PaymentStatusDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getPaymentStatus(
    @Param('orderId') orderId: string,
  ): Promise<PaymentStatusDto> {
    return this.paymentService.getPaymentStatus(orderId);
  }

  @Post(':orderId/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel payment for an order' })
  @ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Payment cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancelPayment(
    @Param('orderId') orderId: string,
    @Body() cancelPaymentDto: CancelPaymentDto,
  ): Promise<{ message: string }> {
    await this.paymentService.cancelPayment(orderId);
    return { message: 'Payment cancelled successfully' };
  }

  @Post('webhook/midtrans')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Midtrans webhook endpoint (internal use only)' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleMidtransWebhook(
    @Body() webhookPayload: WebhookPayloadDto,
  ): Promise<{ message: string }> {
    await this.paymentService.handleWebhook(webhookPayload);
    return { message: 'Webhook processed successfully' };
  }
}
