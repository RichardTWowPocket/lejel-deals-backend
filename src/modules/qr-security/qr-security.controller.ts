import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QRCodeSecurityService } from './qr-security.service';
import {
  GenerateQRCodeDto,
  ValidateQRCodeDto,
  RedeemQRCodeDto,
  RevokeQRCodeDto,
  QRCodeResponseDto,
  QRCodeValidationResponseDto,
  QRCodeStatsDto,
  QRCodeHistoryDto,
} from './dto/qr-security.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('QR Code Security')
@Controller('qr-security')
export class QRCodeSecurityController {
  constructor(private readonly qrSecurityService: QRCodeSecurityService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate secure QR code for coupon' })
  @ApiResponse({
    status: 201,
    description: 'QR code generated successfully',
    type: QRCodeResponseDto,
  })
  async generateQRCode(
    @Body() generateQRCodeDto: GenerateQRCodeDto,
  ): Promise<QRCodeResponseDto> {
    const qrToken = await this.qrSecurityService.generateSecureQRCode(
      generateQRCodeDto.couponId,
    );

    // Get coupon details for response
    const validation = await this.qrSecurityService.validateQRCode(qrToken);

    return {
      qrToken,
      expiresAt: validation.payload!.expiresAt,
      issuedAt: validation.payload!.issuedAt,
      coupon: {
        id: validation.coupon!.id,
        orderId: validation.coupon!.orderId,
        dealId: validation.coupon!.dealId,
        status: validation.coupon!.status,
        expiresAt: validation.coupon!.expiresAt,
      },
      order: {
        id: validation.order!.id,
        orderNumber: validation.order!.orderNumber,
        customerId: validation.order!.customerId,
        totalAmount: Number(validation.order!.totalAmount),
      },
      deal: {
        id: validation.deal!.id,
        title: validation.deal!.title,
        merchantId: validation.deal!.merchantId,
      },
      customer: {
        id: validation.customer!.id,
        firstName: validation.customer!.firstName,
        lastName: validation.customer!.lastName,
        email: validation.customer!.email,
      },
      merchant: {
        id: validation.merchant!.id,
        name: validation.merchant!.name,
        email: validation.merchant!.email,
      },
    };
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate QR code' })
  @ApiResponse({
    status: 200,
    description: 'QR code validation result',
    type: QRCodeValidationResponseDto,
  })
  async validateQRCode(
    @Body() validateQRCodeDto: ValidateQRCodeDto,
  ): Promise<QRCodeValidationResponseDto> {
    return this.qrSecurityService.validateQRCode(
      validateQRCodeDto.qrToken,
      validateQRCodeDto.staffId,
    );
  }

  @Post('redeem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redeem QR code (mark as used)' })
  @ApiResponse({ status: 200, description: 'QR code redeemed successfully' })
  async redeemQRCode(
    @Body() redeemQRCodeDto: RedeemQRCodeDto,
  ): Promise<{ success: boolean; message: string }> {
    // First validate the QR code
    const validation = await this.qrSecurityService.validateQRCode(
      redeemQRCodeDto.qrToken,
      redeemQRCodeDto.staffId,
    );

    if (!validation.isValid) {
      return {
        success: false,
        message: validation.error || 'Invalid QR code',
      };
    }

    // Mark as used
    await this.qrSecurityService.markQRCodeAsUsed(
      validation.payload!.couponId,
      redeemQRCodeDto.staffId,
      redeemQRCodeDto.notes,
    );

    return {
      success: true,
      message: 'QR code redeemed successfully',
    };
  }

  @Post('revoke')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke QR code (invalidate it)' })
  @ApiResponse({ status: 200, description: 'QR code revoked successfully' })
  async revokeQRCode(
    @Body() revokeQRCodeDto: RevokeQRCodeDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.qrSecurityService.revokeQRCode(
      revokeQRCodeDto.couponId,
      revokeQRCodeDto.reason,
    );

    return {
      success: true,
      message: 'QR code revoked successfully',
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get QR code security statistics' })
  @ApiResponse({
    status: 200,
    description: 'QR code statistics retrieved successfully',
    type: QRCodeStatsDto,
  })
  async getQRCodeStats(): Promise<QRCodeStatsDto> {
    return this.qrSecurityService.getQRCodeStats();
  }

  @Get('history/:couponId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get QR code activity history for a coupon' })
  @ApiResponse({
    status: 200,
    description: 'QR code history retrieved successfully',
    type: QRCodeHistoryDto,
  })
  async getQRCodeHistory(
    @Param('couponId') couponId: string,
  ): Promise<QRCodeHistoryDto> {
    const activities = await this.qrSecurityService.getQRCodeHistory(couponId);

    return {
      activities,
      total: activities.length,
    };
  }

  @Post('cleanup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clean up expired QR codes (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Expired QR codes cleaned up successfully',
  })
  async cleanupExpiredQRCodes(): Promise<{
    success: boolean;
    cleanedCount: number;
    message: string;
  }> {
    const cleanedCount = await this.qrSecurityService.cleanupExpiredQRCodes();

    return {
      success: true,
      cleanedCount,
      message: `Cleaned up ${cleanedCount} expired QR codes`,
    };
  }

  @Get('validate/:qrToken')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate QR code via URL parameter' })
  @ApiResponse({
    status: 200,
    description: 'QR code validation result',
    type: QRCodeValidationResponseDto,
  })
  async validateQRCodeByToken(
    @Param('qrToken') qrToken: string,
    @Query('staffId') staffId?: string,
  ): Promise<QRCodeValidationResponseDto> {
    return this.qrSecurityService.validateQRCode(qrToken, staffId);
  }

  @Get('health')
  @ApiOperation({ summary: 'QR code security service health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck(): Promise<{
    status: string;
    timestamp: Date;
    service: string;
  }> {
    return {
      status: 'healthy',
      timestamp: new Date(),
      service: 'QR Code Security Service',
    };
  }
}
