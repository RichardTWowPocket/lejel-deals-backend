import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

export interface MidtransPaymentRequest {
  orderId: string;
  amount: number;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface MidtransPaymentResponse {
  token: string;
  redirect_url: string;
  status_code: string;
  status_message: string;
}

export interface MidtransWebhookPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  payment_type: string;
  transaction_status: string;
  transaction_time: string;
  transaction_id: string;
  fraud_status?: string;
  settlement_time?: string;
  signature_key: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly midtransServerKey: string;
  private readonly midtransClientKey: string;
  private readonly midtransIsProduction: boolean;
  private readonly midtransBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.midtransServerKey = this.configService.get<string>('MIDTRANS_SERVER_KEY') || '';
    this.midtransClientKey = this.configService.get<string>('MIDTRANS_CLIENT_KEY') || '';
    this.midtransIsProduction = this.configService.get<string>('NODE_ENV') === 'production';
    this.midtransBaseUrl = this.midtransIsProduction 
      ? 'https://api.midtrans.com' 
      : 'https://api.sandbox.midtrans.com';
  }

  async createPayment(paymentRequest: MidtransPaymentRequest): Promise<MidtransPaymentResponse> {
    try {
      // Validate order exists and is in PENDING status
      const order = await this.prisma.order.findUnique({
        where: { id: paymentRequest.orderId },
        include: {
          customer: true,
          deal: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Order is not in pending status');
      }

      // Prepare Midtrans payment request
      const midtransRequest = {
        transaction_details: {
          order_id: order.orderNumber,
          gross_amount: paymentRequest.amount,
        },
        customer_details: {
          first_name: paymentRequest.customerDetails.firstName,
          last_name: paymentRequest.customerDetails.lastName,
          email: paymentRequest.customerDetails.email,
          phone: paymentRequest.customerDetails.phone,
        },
        item_details: paymentRequest.itemDetails,
        callbacks: {
          finish: `${this.configService.get<string>('FRONTEND_URL')}/payment/success`,
          pending: `${this.configService.get<string>('FRONTEND_URL')}/payment/pending`,
          error: `${this.configService.get<string>('FRONTEND_URL')}/payment/error`,
        },
        enabled_payments: [
          'credit_card',
          'bca_va',
          'bni_va',
          'bri_va',
          'echannel',
          'permata_va',
          'gopay',
          'shopeepay',
          'qris',
        ],
        credit_card: {
          secure: true,
          channel: 'migs',
          bank: 'bca',
        },
      };

      // Create payment token with Midtrans
      const response = await axios.post(
        `${this.midtransBaseUrl}/v2/charge`,
        midtransRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${Buffer.from(this.midtransServerKey + ':').toString('base64')}`,
          },
        },
      );

      const paymentResponse: MidtransPaymentResponse = response.data;

      // Update order with payment reference
      await this.prisma.order.update({
        where: { id: paymentRequest.orderId },
        data: {
          paymentReference: paymentResponse.token,
        },
      });

      // Log payment creation
      await this.logWebhookEvent('midtrans', 'payment_created', {
        orderId: paymentRequest.orderId,
        orderNumber: order.orderNumber,
        amount: paymentRequest.amount,
        token: paymentResponse.token,
      }, 'success');

      this.logger.log(`Payment created for order ${order.orderNumber}: ${paymentResponse.token}`);

      return paymentResponse;
    } catch (error) {
      this.logger.error(`Failed to create payment for order ${paymentRequest.orderId}:`, error);
      
      // Log error
      await this.logWebhookEvent('midtrans', 'payment_creation_failed', {
        orderId: paymentRequest.orderId,
        error: error.message,
      }, 'error');

      throw new BadRequestException('Failed to create payment: ' + error.message);
    }
  }

  async handleWebhook(payload: MidtransWebhookPayload): Promise<void> {
    try {
      // Verify signature
      const isValidSignature = this.verifySignature(payload);
      if (!isValidSignature) {
        this.logger.warn('Invalid webhook signature received');
        throw new BadRequestException('Invalid signature');
      }

      // Find order by order number
      const order = await this.prisma.order.findUnique({
        where: { orderNumber: payload.order_id },
        include: {
          customer: true,
          deal: true,
        },
      });

      if (!order) {
        this.logger.warn(`Order not found for webhook: ${payload.order_id}`);
        throw new NotFoundException('Order not found');
      }

      // Update order status based on transaction status
      let newStatus: OrderStatus;
      let updateData: any = {
        paymentReference: payload.transaction_id,
      };

      switch (payload.transaction_status) {
        case 'capture':
          if (payload.fraud_status === 'accept') {
            newStatus = OrderStatus.PAID;
            updateData.paymentMethod = payload.payment_type;
          } else {
            newStatus = OrderStatus.PENDING;
          }
          break;
        case 'settlement':
          newStatus = OrderStatus.PAID;
          updateData.paymentMethod = payload.payment_type;
          break;
        case 'pending':
          newStatus = OrderStatus.PENDING;
          break;
        case 'deny':
        case 'cancel':
        case 'expire':
          newStatus = OrderStatus.CANCELLED;
          break;
        case 'refund':
          newStatus = OrderStatus.REFUNDED;
          break;
        default:
          this.logger.warn(`Unknown transaction status: ${payload.transaction_status}`);
          return;
      }

      // Update order
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
          ...updateData,
        },
      });

      // If order is paid, generate coupons
      if (newStatus === OrderStatus.PAID) {
        await this.generateCouponsForOrder(order.id);
      }

      // Log webhook event
      await this.logWebhookEvent('midtrans', 'webhook_received', payload, 'success');

      this.logger.log(`Order ${order.orderNumber} status updated to ${newStatus} via webhook`);

    } catch (error) {
      this.logger.error('Webhook processing failed:', error);
      
      // Log error
      await this.logWebhookEvent('midtrans', 'webhook_processing_failed', {
        payload,
        error: error.message,
      }, 'error');

      throw error;
    }
  }

  async getPaymentStatus(orderId: string): Promise<any> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: true,
          deal: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (!order.paymentReference) {
        return {
          status: 'not_created',
          message: 'Payment not yet created',
        };
      }

      // Check status with Midtrans
      const response = await axios.get(
        `${this.midtransBaseUrl}/v2/${order.orderNumber}/status`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${Buffer.from(this.midtransServerKey + ':').toString('base64')}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get payment status for order ${orderId}:`, error);
      throw new BadRequestException('Failed to get payment status');
    }
  }

  async cancelPayment(orderId: string): Promise<void> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be cancelled');
      }

      // Cancel payment with Midtrans
      await axios.post(
        `${this.midtransBaseUrl}/v2/${order.orderNumber}/cancel`,
        {},
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${Buffer.from(this.midtransServerKey + ':').toString('base64')}`,
          },
        },
      );

      // Update order status
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });

      this.logger.log(`Payment cancelled for order ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to cancel payment for order ${orderId}:`, error);
      throw new BadRequestException('Failed to cancel payment');
    }
  }

  private verifySignature(payload: MidtransWebhookPayload): boolean {
    try {
      const { signature_key, ...data } = payload;
      const expectedSignature = this.generateSignature(data);
      return signature_key === expectedSignature;
    } catch (error) {
      this.logger.error('Signature verification failed:', error);
      return false;
    }
  }

  private generateSignature(data: any): string {
    const crypto = require('crypto');
    const stringToSign = `${data.order_id}${data.status_code}${data.gross_amount}${this.midtransServerKey}`;
    return crypto.createHash('sha512').update(stringToSign).digest('hex');
  }

  private async logWebhookEvent(source: string, event: string, payload: any, status: string): Promise<void> {
    try {
      await this.prisma.webhookLog.create({
        data: {
          source,
          event,
          payload: payload as any,
          status,
          response: status === 'success' ? { processed: true } : { error: payload.error },
        },
      });
    } catch (error) {
      this.logger.error('Failed to log webhook event:', error);
    }
  }

  private async generateCouponsForOrder(orderId: string): Promise<void> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          deal: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Generate coupons based on quantity
      const coupons: Array<{
        orderId: string;
        dealId: string;
        qrCode: string;
        expiresAt: Date;
      }> = [];
      
      for (let i = 0; i < order.quantity; i++) {
        const qrCode = await this.generateQRCode(orderId, i + 1);
        const expiresAt = new Date(order.deal.validUntil.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days after deal expires

        coupons.push({
          orderId: order.id,
          dealId: order.dealId,
          qrCode,
          expiresAt,
        });
      }

      // Create coupons in database
      await this.prisma.coupon.createMany({
        data: coupons,
      });

      this.logger.log(`Generated ${coupons.length} coupons for order ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to generate coupons for order ${orderId}:`, error);
      throw new BadRequestException('Failed to generate coupons');
    }
  }

  private async generateQRCode(orderId: string, couponNumber: number): Promise<string> {
    const QRCode = require('qrcode');
    
    const qrData = {
      orderId,
      couponNumber,
      timestamp: new Date().toISOString(),
      type: 'coupon',
    };

    const qrCodeString = await QRCode.toString(JSON.stringify(qrData), {
      type: 'utf8',
      errorCorrectionLevel: 'M',
    });

    return qrCodeString;
  }
}
