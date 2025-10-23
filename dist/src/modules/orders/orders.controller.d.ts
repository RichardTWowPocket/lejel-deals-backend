import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./dto/create-order.dto").OrderResponseDto>;
    findAll(page: number, limit: number, status?: OrderStatus, customerId?: string, dealId?: string, merchantId?: string): Promise<{
        orders: import("./dto/create-order.dto").OrderResponseDto[];
        pagination: any;
    }>;
    getStats(): Promise<import("./dto/create-order.dto").OrderStatsDto>;
    getAnalytics(period?: string): Promise<import("./dto/create-order.dto").OrderAnalyticsDto>;
    findByCustomer(customerId: string, page: number, limit: number): Promise<{
        orders: import("./dto/create-order.dto").OrderResponseDto[];
        pagination: any;
    }>;
    findMine(user: any, page: number, limit: number): Promise<{
        orders: import("./dto/create-order.dto").OrderResponseDto[];
        pagination: any;
    }>;
    findByMerchant(merchantId: string, page: number, limit: number): Promise<{
        orders: import("./dto/create-order.dto").OrderResponseDto[];
        pagination: any;
    }>;
    findByOrderNumber(orderNumber: string): Promise<import("./dto/create-order.dto").OrderResponseDto>;
    findOne(id: string): Promise<import("./dto/create-order.dto").OrderResponseDto>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./dto/create-order.dto").OrderResponseDto>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<import("./dto/create-order.dto").OrderResponseDto>;
    cancel(id: string, reason?: string): Promise<import("./dto/create-order.dto").OrderResponseDto>;
    refund(id: string, reason?: string): Promise<import("./dto/create-order.dto").OrderResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
