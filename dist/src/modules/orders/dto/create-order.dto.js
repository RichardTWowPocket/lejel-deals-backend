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
exports.OrderAnalyticsDto = exports.OrderStatsDto = exports.OrderResponseDto = exports.UpdateOrderStatusDto = exports.UpdateOrderDto = exports.CreateOrderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateOrderDto {
    customerId;
    dealId;
    quantity;
    paymentMethod;
    paymentReference;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'customer-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal ID', example: 'deal-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "dealId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity of deals to order', example: 2, minimum: 1, maximum: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment method', example: 'credit_card' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment reference from payment gateway', example: 'midtrans_ref_123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentReference", void 0);
class UpdateOrderDto {
    status;
    paymentMethod;
    paymentReference;
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order status', enum: client_1.OrderStatus, example: client_1.OrderStatus.PAID }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment method', example: 'credit_card' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment reference from payment gateway', example: 'midtrans_ref_123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "paymentReference", void 0);
class UpdateOrderStatusDto {
    status;
    paymentReference;
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New order status', enum: client_1.OrderStatus, example: client_1.OrderStatus.PAID }),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment reference if status is PAID', example: 'midtrans_ref_123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "paymentReference", void 0);
class OrderResponseDto {
    id;
    orderNumber;
    customerId;
    dealId;
    quantity;
    totalAmount;
    status;
    paymentMethod;
    paymentReference;
    createdAt;
    updatedAt;
    customer;
    deal;
    coupons;
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID', example: 'order-123' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique order number', example: 'ORD-2024-001' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'customer-123' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deal ID', example: 'deal-123' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "dealId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity ordered', example: 2 }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount in IDR', example: 150000 }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order status', enum: client_1.OrderStatus, example: client_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment method used', example: 'credit_card' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment reference from gateway', example: 'midtrans_ref_123' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order creation date', example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order last update date', example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer information' }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deal information' }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "deal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Generated coupons for this order' }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "coupons", void 0);
class OrderStatsDto {
    totalOrders;
    pendingOrders;
    paidOrders;
    cancelledOrders;
    refundedOrders;
    totalRevenue;
    averageOrderValue;
    statusDistribution;
}
exports.OrderStatsDto = OrderStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders count', example: 150 }),
    __metadata("design:type", Number)
], OrderStatsDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pending orders count', example: 25 }),
    __metadata("design:type", Number)
], OrderStatsDto.prototype, "pendingOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Paid orders count', example: 100 }),
    __metadata("design:type", Number)
], OrderStatsDto.prototype, "paidOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cancelled orders count', example: 15 }),
    __metadata("design:type", Number)
], OrderStatsDto.prototype, "cancelledOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refunded orders count', example: 10 }),
    __metadata("design:type", Number)
], OrderStatsDto.prototype, "refundedOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total revenue in IDR', example: 5000000 }),
    __metadata("design:type", Number)
], OrderStatsDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average order value in IDR', example: 33333 }),
    __metadata("design:type", Number)
], OrderStatsDto.prototype, "averageOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders by status distribution' }),
    __metadata("design:type", Object)
], OrderStatsDto.prototype, "statusDistribution", void 0);
class OrderAnalyticsDto {
    ordersByPeriod;
    revenueByPeriod;
    topCustomers;
    topDeals;
    completionRate;
    averageTimeToPayment;
}
exports.OrderAnalyticsDto = OrderAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders count by period', example: { '2024-01': 25, '2024-02': 30 } }),
    __metadata("design:type", Object)
], OrderAnalyticsDto.prototype, "ordersByPeriod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Revenue by period', example: { '2024-01': 1000000, '2024-02': 1200000 } }),
    __metadata("design:type", Object)
], OrderAnalyticsDto.prototype, "revenueByPeriod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top customers by order count' }),
    __metadata("design:type", Array)
], OrderAnalyticsDto.prototype, "topCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top deals by order count' }),
    __metadata("design:type", Array)
], OrderAnalyticsDto.prototype, "topDeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order completion rate percentage', example: 85.5 }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "completionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average time to payment in hours', example: 2.5 }),
    __metadata("design:type", Number)
], OrderAnalyticsDto.prototype, "averageTimeToPayment", void 0);
//# sourceMappingURL=create-order.dto.js.map