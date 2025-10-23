import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto, OrderResponseDto, OrderStatsDto, OrderAnalyticsDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto, userId?: string): Promise<OrderResponseDto>;
    findAll(page?: number, limit?: number, status?: OrderStatus, customerId?: string, dealId?: string, merchantId?: string): Promise<{
        orders: OrderResponseDto[];
        pagination: any;
    }>;
    findOne(id: string): Promise<OrderResponseDto>;
    findByOrderNumber(orderNumber: string): Promise<OrderResponseDto>;
    findByCustomer(customerId: string, page?: number, limit?: number): Promise<{
        orders: OrderResponseDto[];
        pagination: any;
    }>;
    findByMerchant(merchantId: string, page?: number, limit?: number): Promise<{
        orders: OrderResponseDto[];
        pagination: any;
    }>;
    findMine(userId: string, page?: number, limit?: number): Promise<{
        orders: OrderResponseDto[];
        pagination: any;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
    cancel(id: string, reason?: string): Promise<OrderResponseDto>;
    refund(id: string, reason?: string): Promise<OrderResponseDto>;
    remove(id: string): Promise<void>;
    getStats(): Promise<OrderStatsDto>;
    getAnalytics(period?: string): Promise<OrderAnalyticsDto>;
    private generateOrderNumber;
    private isValidStatusTransition;
    private mapToOrderResponseDto;
    private formatPeriodData;
    private enrichTopCustomers;
    private enrichTopDeals;
}
