import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
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
export declare class PaymentService {
    private configService;
    private prisma;
    private readonly logger;
    private readonly midtransServerKey;
    private readonly midtransClientKey;
    private readonly midtransIsProduction;
    private readonly midtransBaseUrl;
    constructor(configService: ConfigService, prisma: PrismaService);
    createPayment(paymentRequest: MidtransPaymentRequest): Promise<MidtransPaymentResponse>;
    handleWebhook(payload: MidtransWebhookPayload): Promise<void>;
    getPaymentStatus(orderId: string): Promise<any>;
    cancelPayment(orderId: string): Promise<void>;
    private verifySignature;
    private generateSignature;
    private logWebhookEvent;
    private generateCouponsForOrder;
    private generateQRCode;
}
