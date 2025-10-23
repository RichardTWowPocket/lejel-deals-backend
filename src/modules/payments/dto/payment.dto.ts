import { IsString, IsNumber, IsArray, IsObject, IsOptional, IsEmail, IsPhoneNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID', example: 'order-123' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Payment amount in IDR', example: 150000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Customer details' })
  @IsObject()
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  @ApiProperty({ description: 'Item details' })
  @IsArray()
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment token', example: 'midtrans_token_123' })
  token: string;

  @ApiProperty({ description: 'Payment redirect URL', example: 'https://app.midtrans.com/snap/v2/vtweb/...' })
  redirect_url: string;

  @ApiProperty({ description: 'Status code', example: '201' })
  status_code: string;

  @ApiProperty({ description: 'Status message', example: 'Success' })
  status_message: string;
}

export class PaymentStatusDto {
  @ApiProperty({ description: 'Order ID', example: 'ORD-202401-001' })
  order_id: string;

  @ApiProperty({ description: 'Transaction status', example: 'settlement' })
  transaction_status: string;

  @ApiProperty({ description: 'Payment type', example: 'credit_card' })
  payment_type: string;

  @ApiProperty({ description: 'Gross amount', example: '150000.00' })
  gross_amount: string;

  @ApiProperty({ description: 'Transaction time', example: '2024-01-01 12:00:00' })
  transaction_time: string;

  @ApiProperty({ description: 'Transaction ID', example: 'txn_123456' })
  transaction_id: string;

  @ApiPropertyOptional({ description: 'Fraud status', example: 'accept' })
  fraud_status?: string;

  @ApiPropertyOptional({ description: 'Settlement time', example: '2024-01-01 12:05:00' })
  settlement_time?: string;
}

export class WebhookPayloadDto {
  @ApiProperty({ description: 'Order ID', example: 'ORD-202401-001' })
  @IsString()
  order_id: string;

  @ApiProperty({ description: 'Status code', example: '200' })
  @IsString()
  status_code: string;

  @ApiProperty({ description: 'Gross amount', example: '150000.00' })
  @IsString()
  gross_amount: string;

  @ApiProperty({ description: 'Payment type', example: 'credit_card' })
  @IsString()
  payment_type: string;

  @ApiProperty({ description: 'Transaction status', example: 'settlement' })
  @IsString()
  transaction_status: string;

  @ApiProperty({ description: 'Transaction time', example: '2024-01-01 12:00:00' })
  @IsString()
  transaction_time: string;

  @ApiProperty({ description: 'Transaction ID', example: 'txn_123456' })
  @IsString()
  transaction_id: string;

  @ApiPropertyOptional({ description: 'Fraud status', example: 'accept' })
  @IsOptional()
  @IsString()
  fraud_status?: string;

  @ApiPropertyOptional({ description: 'Settlement time', example: '2024-01-01 12:05:00' })
  @IsOptional()
  @IsString()
  settlement_time?: string;

  @ApiProperty({ description: 'Signature key for verification', example: 'signature_hash' })
  @IsString()
  signature_key: string;
}

export class CancelPaymentDto {
  @ApiProperty({ description: 'Cancellation reason', example: 'Customer requested cancellation' })
  @IsString()
  reason: string;
}



