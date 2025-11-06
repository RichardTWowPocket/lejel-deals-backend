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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelPaymentDto = exports.WebhookPayloadDto = exports.PaymentStatusDto = exports.PaymentResponseDto = exports.CreatePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePaymentDto {
    orderId;
    amount;
    customerDetails;
    itemDetails;
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID', example: 'order-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment amount in IDR', example: 150000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer details' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePaymentDto.prototype, "customerDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item details' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePaymentDto.prototype, "itemDetails", void 0);
class PaymentResponseDto {
    token;
    redirect_url;
    status_code;
    status_message;
}
exports.PaymentResponseDto = PaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment token', example: 'midtrans_token_123' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment redirect URL',
        example: 'https://app.midtrans.com/snap/v2/vtweb/...',
    }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "redirect_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status code', example: '201' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "status_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status message', example: 'Success' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "status_message", void 0);
class PaymentStatusDto {
    order_id;
    transaction_status;
    payment_type;
    gross_amount;
    transaction_time;
    transaction_id;
    fraud_status;
    settlement_time;
}
exports.PaymentStatusDto = PaymentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID', example: 'ORD-202401-001' }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction status', example: 'settlement' }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "transaction_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment type', example: 'credit_card' }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "payment_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gross amount', example: '150000.00' }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "gross_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction time',
        example: '2024-01-01 12:00:00',
    }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "transaction_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: 'txn_123456' }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "transaction_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fraud status', example: 'accept' }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "fraud_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Settlement time',
        example: '2024-01-01 12:05:00',
    }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "settlement_time", void 0);
class WebhookPayloadDto {
    order_id;
    status_code;
    gross_amount;
    payment_type;
    transaction_status;
    transaction_time;
    transaction_id;
    fraud_status;
    settlement_time;
    signature_key;
}
exports.WebhookPayloadDto = WebhookPayloadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID', example: 'ORD-202401-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status code', example: '200' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "status_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gross amount', example: '150000.00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "gross_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment type', example: 'credit_card' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "payment_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction status', example: 'settlement' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "transaction_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction time',
        example: '2024-01-01 12:00:00',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "transaction_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: 'txn_123456' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "transaction_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fraud status', example: 'accept' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "fraud_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Settlement time',
        example: '2024-01-01 12:05:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "settlement_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Signature key for verification',
        example: 'signature_hash',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPayloadDto.prototype, "signature_key", void 0);
class CancelPaymentDto {
    reason;
}
exports.CancelPaymentDto = CancelPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cancellation reason',
        example: 'Customer requested cancellation',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelPaymentDto.prototype, "reason", void 0);
//# sourceMappingURL=payment.dto.js.map