"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentService = PaymentService_1 = class PaymentService {
    configService;
    prisma;
    logger = new common_1.Logger(PaymentService_1.name);
    midtransServerKey;
    midtransClientKey;
    midtransIsProduction;
    midtransBaseUrl;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.midtransServerKey = this.configService.get('MIDTRANS_SERVER_KEY') || '';
        this.midtransClientKey = this.configService.get('MIDTRANS_CLIENT_KEY') || '';
        this.midtransIsProduction = this.configService.get('NODE_ENV') === 'production';
        this.midtransBaseUrl = this.midtransIsProduction
            ? 'https://api.midtrans.com'
            : 'https://api.sandbox.midtrans.com';
    }
    async createPayment(paymentRequest) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: paymentRequest.orderId },
                include: {
                    customer: true,
                    deal: true,
                },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (order.status !== client_1.OrderStatus.PENDING) {
                throw new common_1.BadRequestException('Order is not in pending status');
            }
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
                    finish: `${this.configService.get('FRONTEND_URL')}/payment/success`,
                    pending: `${this.configService.get('FRONTEND_URL')}/payment/pending`,
                    error: `${this.configService.get('FRONTEND_URL')}/payment/error`,
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
            const response = await axios_1.default.post(`${this.midtransBaseUrl}/v2/charge`, midtransRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(this.midtransServerKey + ':').toString('base64')}`,
                },
            });
            const paymentResponse = response.data;
            await this.prisma.order.update({
                where: { id: paymentRequest.orderId },
                data: {
                    paymentReference: paymentResponse.token,
                },
            });
            await this.logWebhookEvent('midtrans', 'payment_created', {
                orderId: paymentRequest.orderId,
                orderNumber: order.orderNumber,
                amount: paymentRequest.amount,
                token: paymentResponse.token,
            }, 'success');
            this.logger.log(`Payment created for order ${order.orderNumber}: ${paymentResponse.token}`);
            return paymentResponse;
        }
        catch (error) {
            this.logger.error(`Failed to create payment for order ${paymentRequest.orderId}:`, error);
            await this.logWebhookEvent('midtrans', 'payment_creation_failed', {
                orderId: paymentRequest.orderId,
                error: error.message,
            }, 'error');
            throw new common_1.BadRequestException('Failed to create payment: ' + error.message);
        }
    }
    async handleWebhook(payload) {
        try {
            const isValidSignature = this.verifySignature(payload);
            if (!isValidSignature) {
                this.logger.warn('Invalid webhook signature received');
                throw new common_1.BadRequestException('Invalid signature');
            }
            const order = await this.prisma.order.findUnique({
                where: { orderNumber: payload.order_id },
                include: {
                    customer: true,
                    deal: true,
                },
            });
            if (!order) {
                this.logger.warn(`Order not found for webhook: ${payload.order_id}`);
                throw new common_1.NotFoundException('Order not found');
            }
            let newStatus;
            let updateData = {
                paymentReference: payload.transaction_id,
            };
            switch (payload.transaction_status) {
                case 'capture':
                    if (payload.fraud_status === 'accept') {
                        newStatus = client_1.OrderStatus.PAID;
                        updateData.paymentMethod = payload.payment_type;
                    }
                    else {
                        newStatus = client_1.OrderStatus.PENDING;
                    }
                    break;
                case 'settlement':
                    newStatus = client_1.OrderStatus.PAID;
                    updateData.paymentMethod = payload.payment_type;
                    break;
                case 'pending':
                    newStatus = client_1.OrderStatus.PENDING;
                    break;
                case 'deny':
                case 'cancel':
                case 'expire':
                    newStatus = client_1.OrderStatus.CANCELLED;
                    break;
                case 'refund':
                    newStatus = client_1.OrderStatus.REFUNDED;
                    break;
                default:
                    this.logger.warn(`Unknown transaction status: ${payload.transaction_status}`);
                    return;
            }
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    status: newStatus,
                    ...updateData,
                },
            });
            if (newStatus === client_1.OrderStatus.PAID) {
                await this.generateCouponsForOrder(order.id);
            }
            await this.logWebhookEvent('midtrans', 'webhook_received', payload, 'success');
            this.logger.log(`Order ${order.orderNumber} status updated to ${newStatus} via webhook`);
        }
        catch (error) {
            this.logger.error('Webhook processing failed:', error);
            await this.logWebhookEvent('midtrans', 'webhook_processing_failed', {
                payload,
                error: error.message,
            }, 'error');
            throw error;
        }
    }
    async getPaymentStatus(orderId) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    customer: true,
                    deal: true,
                },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (!order.paymentReference) {
                return {
                    status: 'not_created',
                    message: 'Payment not yet created',
                };
            }
            const response = await axios_1.default.get(`${this.midtransBaseUrl}/v2/${order.orderNumber}/status`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(this.midtransServerKey + ':').toString('base64')}`,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get payment status for order ${orderId}:`, error);
            throw new common_1.BadRequestException('Failed to get payment status');
        }
    }
    async cancelPayment(orderId) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (order.status !== client_1.OrderStatus.PENDING) {
                throw new common_1.BadRequestException('Only pending orders can be cancelled');
            }
            await axios_1.default.post(`${this.midtransBaseUrl}/v2/${order.orderNumber}/cancel`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(this.midtransServerKey + ':').toString('base64')}`,
                },
            });
            await this.prisma.order.update({
                where: { id: orderId },
                data: {
                    status: client_1.OrderStatus.CANCELLED,
                },
            });
            this.logger.log(`Payment cancelled for order ${order.orderNumber}`);
        }
        catch (error) {
            this.logger.error(`Failed to cancel payment for order ${orderId}:`, error);
            throw new common_1.BadRequestException('Failed to cancel payment');
        }
    }
    verifySignature(payload) {
        try {
            const { signature_key, ...data } = payload;
            const expectedSignature = this.generateSignature(data);
            return signature_key === expectedSignature;
        }
        catch (error) {
            this.logger.error('Signature verification failed:', error);
            return false;
        }
    }
    generateSignature(data) {
        const crypto = require('crypto');
        const stringToSign = `${data.order_id}${data.status_code}${data.gross_amount}${this.midtransServerKey}`;
        return crypto.createHash('sha512').update(stringToSign).digest('hex');
    }
    async logWebhookEvent(source, event, payload, status) {
        try {
            await this.prisma.webhookLog.create({
                data: {
                    source,
                    event,
                    payload: payload,
                    status,
                    response: status === 'success' ? { processed: true } : { error: payload.error },
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log webhook event:', error);
        }
    }
    async generateCouponsForOrder(orderId) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    deal: true,
                },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            const coupons = [];
            for (let i = 0; i < order.quantity; i++) {
                const qrCode = await this.generateQRCode(orderId, i + 1);
                const expiresAt = new Date(order.deal.validUntil.getTime() + (30 * 24 * 60 * 60 * 1000));
                coupons.push({
                    orderId: order.id,
                    dealId: order.dealId,
                    qrCode,
                    expiresAt,
                });
            }
            await this.prisma.coupon.createMany({
                data: coupons,
            });
            this.logger.log(`Generated ${coupons.length} coupons for order ${order.orderNumber}`);
        }
        catch (error) {
            this.logger.error(`Failed to generate coupons for order ${orderId}:`, error);
            throw new common_1.BadRequestException('Failed to generate coupons');
        }
    }
    async generateQRCode(orderId, couponNumber) {
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map