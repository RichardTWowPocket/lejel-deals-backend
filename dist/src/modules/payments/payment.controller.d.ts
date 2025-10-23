import { PaymentService } from './payment.service';
import { CreatePaymentDto, PaymentResponseDto, PaymentStatusDto, WebhookPayloadDto, CancelPaymentDto } from './dto/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    getPaymentStatus(orderId: string): Promise<PaymentStatusDto>;
    cancelPayment(orderId: string, cancelPaymentDto: CancelPaymentDto): Promise<{
        message: string;
    }>;
    handleMidtransWebhook(webhookPayload: WebhookPayloadDto): Promise<{
        message: string;
    }>;
}
