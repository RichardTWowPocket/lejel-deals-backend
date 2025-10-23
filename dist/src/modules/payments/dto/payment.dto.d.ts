export declare class CreatePaymentDto {
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
export declare class PaymentResponseDto {
    token: string;
    redirect_url: string;
    status_code: string;
    status_message: string;
}
export declare class PaymentStatusDto {
    order_id: string;
    transaction_status: string;
    payment_type: string;
    gross_amount: string;
    transaction_time: string;
    transaction_id: string;
    fraud_status?: string;
    settlement_time?: string;
}
export declare class WebhookPayloadDto {
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
export declare class CancelPaymentDto {
    reason: string;
}
