import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto, OrderResponseDto, OrderStatsDto, OrderAnalyticsDto } from './dto/create-order.dto';
import { OrderStatus, DealStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId?: string): Promise<OrderResponseDto> {
    const { customerId, dealId, quantity, paymentMethod, paymentReference } = createOrderDto;

    // Validate customer exists and is active
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId, isActive: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found or inactive');
    }

    // Validate deal exists and is active
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        merchant: true,
      },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    if (deal.status !== DealStatus.ACTIVE) {
      throw new BadRequestException('Deal is not active');
    }

    // Check if deal is still valid
    const now = new Date();
    if (now < deal.validFrom || now > deal.validUntil) {
      throw new BadRequestException('Deal is not within valid period');
    }

    // Check quantity availability
    if (deal.maxQuantity && (deal.soldQuantity + quantity) > deal.maxQuantity) {
      throw new BadRequestException('Insufficient quantity available');
    }

    // Calculate total amount
    const totalAmount = new Decimal(deal.discountPrice).mul(quantity);

    // Generate unique order number
    const orderNumber = await this.generateOrderNumber();

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        dealId,
        quantity,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentMethod,
        paymentReference,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountPrice: true,
            merchantId: true,
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupons: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    // Update deal sold quantity
    await this.prisma.deal.update({
      where: { id: dealId },
      data: {
        soldQuantity: {
          increment: quantity,
        },
      },
    });

    return this.mapToOrderResponseDto(order);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    customerId?: string,
    dealId?: string,
    merchantId?: string,
  ): Promise<{ orders: OrderResponseDto[]; pagination: any }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (dealId) where.dealId = dealId;
    if (merchantId) {
      where.deal = {
        merchantId: merchantId,
      };
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          deal: {
            select: {
              id: true,
              title: true,
              description: true,
              discountPrice: true,
              merchantId: true,
              merchant: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          coupons: {
            select: {
              id: true,
              qrCode: true,
              status: true,
              expiresAt: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => this.mapToOrderResponseDto(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountPrice: true,
            merchantId: true,
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupons: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapToOrderResponseDto(order);
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountPrice: true,
            merchantId: true,
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupons: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapToOrderResponseDto(order);
  }

  async findByCustomer(customerId: string, page: number = 1, limit: number = 10): Promise<{ orders: OrderResponseDto[]; pagination: any }> {
    const result = await this.findAll(page, limit, undefined, customerId);
    return result;
  }

  async findByMerchant(merchantId: string, page: number = 1, limit: number = 10): Promise<{ orders: OrderResponseDto[]; pagination: any }> {
    return this.findAll(page, limit, undefined, undefined, undefined, merchantId);
  }

  async findMine(userId: string, page: number = 1, limit: number = 10): Promise<{ orders: OrderResponseDto[]; pagination: any }> {
    const customer = await (this.prisma as any).customer.findFirst({ where: { userId: userId } });
    if (!customer) {
      return {
        orders: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
    return this.findByCustomer(customer.id, page, limit);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transitions
    if (updateOrderDto.status && !this.isValidStatusTransition(existingOrder.status, updateOrderDto.status)) {
      throw new BadRequestException(`Invalid status transition from ${existingOrder.status} to ${updateOrderDto.status}`);
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountPrice: true,
            merchantId: true,
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupons: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    return this.mapToOrderResponseDto(order);
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const { status, paymentReference } = updateStatusDto;

    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transitions
    if (!this.isValidStatusTransition(existingOrder.status, status)) {
      throw new BadRequestException(`Invalid status transition from ${existingOrder.status} to ${status}`);
    }

    // Additional validation for PAID status
    if (status === OrderStatus.PAID && !paymentReference) {
      throw new BadRequestException('Payment reference is required when marking order as paid');
    }

    const updateData: any = { status };
    if (paymentReference) {
      updateData.paymentReference = paymentReference;
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountPrice: true,
            merchantId: true,
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupons: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    return this.mapToOrderResponseDto(order);
  }

  async cancel(id: string, reason?: string): Promise<OrderResponseDto> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { deal: true },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    if (existingOrder.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        paymentReference: reason ? `${existingOrder.paymentReference || ''} - Cancelled: ${reason}` : existingOrder.paymentReference,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountPrice: true,
            merchantId: true,
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupons: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    // Restore deal quantity
    await this.prisma.deal.update({
      where: { id: existingOrder.dealId },
      data: {
        soldQuantity: {
          decrement: existingOrder.quantity,
        },
      },
    });

    return this.mapToOrderResponseDto(order);
  }

  async refund(id: string, reason?: string): Promise<OrderResponseDto> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    if (existingOrder.status !== OrderStatus.PAID) {
      throw new BadRequestException('Only paid orders can be refunded');
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.REFUNDED,
        paymentReference: reason ? `${existingOrder.paymentReference || ''} - Refunded: ${reason}` : existingOrder.paymentReference,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountPrice: true,
            merchantId: true,
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        coupons: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    return this.mapToOrderResponseDto(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow deletion of cancelled or refunded orders
    if (order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.REFUNDED) {
      throw new BadRequestException('Only cancelled or refunded orders can be deleted');
    }

    await this.prisma.order.delete({
      where: { id },
    });
  }

  async getStats(): Promise<OrderStatsDto> {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      refundedOrders,
      totalRevenue,
      averageOrderValue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.PAID } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
      this.prisma.order.count({ where: { status: OrderStatus.REFUNDED } }),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.PAID },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.PAID },
        _avg: { totalAmount: true },
      }),
    ]);

    const statusDistribution = {
      [OrderStatus.PENDING]: pendingOrders,
      [OrderStatus.PAID]: paidOrders,
      [OrderStatus.CANCELLED]: cancelledOrders,
      [OrderStatus.REFUNDED]: refundedOrders,
    };

    return {
      totalOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      refundedOrders,
      totalRevenue: totalRevenue._sum.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0,
      averageOrderValue: averageOrderValue._avg.totalAmount ? Number(averageOrderValue._avg.totalAmount) : 0,
      statusDistribution,
    };
  }

  async getAnalytics(period: string = 'month'): Promise<OrderAnalyticsDto> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get orders by period
    const ordersByPeriod = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    // Get top customers
    const topCustomers = await this.prisma.order.groupBy({
      by: ['customerId'],
      where: {
        createdAt: { gte: startDate },
        status: OrderStatus.PAID,
      },
      _count: { id: true },
      _sum: { totalAmount: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 10,
    });

    // Get top deals
    const topDeals = await this.prisma.order.groupBy({
      by: ['dealId'],
      where: {
        createdAt: { gte: startDate },
        status: OrderStatus.PAID,
      },
      _count: { id: true },
      _sum: { totalAmount: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Calculate completion rate
    const totalOrdersInPeriod = await this.prisma.order.count({
      where: { createdAt: { gte: startDate } },
    });
    const completedOrdersInPeriod = await this.prisma.order.count({
      where: {
        createdAt: { gte: startDate },
        status: OrderStatus.PAID,
      },
    });
    const completionRate = totalOrdersInPeriod > 0 ? (completedOrdersInPeriod / totalOrdersInPeriod) * 100 : 0;

    // Calculate average time to payment
    const paidOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PAID,
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const averageTimeToPayment = paidOrders.length > 0
      ? paidOrders.reduce((sum, order) => {
          const timeDiff = order.updatedAt.getTime() - order.createdAt.getTime();
          return sum + (timeDiff / (1000 * 60 * 60)); // Convert to hours
        }, 0) / paidOrders.length
      : 0;

    return {
      ordersByPeriod: this.formatPeriodData(ordersByPeriod, period),
      revenueByPeriod: this.formatPeriodData(ordersByPeriod, period, 'revenue'),
      topCustomers: await this.enrichTopCustomers(topCustomers),
      topDeals: await this.enrichTopDeals(topDeals),
      completionRate,
      averageTimeToPayment,
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Get count of orders this month
    const startOfMonth = new Date(year, new Date().getMonth(), 1);
    const count = await this.prisma.order.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    const orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(3, '0')}`;
    return orderNumber;
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [], // Terminal state
      [OrderStatus.REFUNDED]: [], // Terminal state
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  private mapToOrderResponseDto(order: any): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      dealId: order.dealId,
      quantity: order.quantity,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentReference: order.paymentReference,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customer: order.customer,
      deal: order.deal ? {
        ...order.deal,
        discountPrice: Number(order.deal.discountPrice),
        finalPrice: Number(order.deal.discountPrice), // discountPrice is the coupon face value
      } : undefined,
      coupons: order.coupons,
    };
  }

  private formatPeriodData(data: any[], period: string, type: 'orders' | 'revenue' = 'orders'): Record<string, number> {
    const result: Record<string, number> = {};
    
    data.forEach(item => {
      const date = new Date(item.createdAt);
      let key: string;
      
      switch (period) {
        case 'week':
          key = date.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = String(date.getFullYear());
          break;
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (type === 'revenue') {
        result[key] = (result[key] || 0) + Number(item._sum.totalAmount || 0);
      } else {
        result[key] = (result[key] || 0) + item._count.id;
      }
    });
    
    return result;
  }

  private async enrichTopCustomers(customers: any[]): Promise<any[]> {
    const customerIds = customers.map(c => c.customerId);
    const customerDetails = await this.prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    return customers.map(customer => {
      const details = customerDetails.find(d => d.id === customer.customerId);
      return {
        customerId: customer.customerId,
        customerName: details ? `${details.firstName || ''} ${details.lastName || ''}`.trim() || details.email : 'Unknown',
        orderCount: customer._count.id,
        totalSpent: Number(customer._sum.totalAmount || 0),
      };
    });
  }

  private async enrichTopDeals(deals: any[]): Promise<any[]> {
    const dealIds = deals.map(d => d.dealId);
    const dealDetails = await this.prisma.deal.findMany({
      where: { id: { in: dealIds } },
      select: { id: true, title: true },
    });

    return deals.map(deal => {
      const details = dealDetails.find(d => d.id === deal.dealId);
      return {
        dealId: deal.dealId,
        dealTitle: details?.title || 'Unknown Deal',
        orderCount: deal._count.id,
        totalRevenue: Number(deal._sum.totalAmount || 0),
      };
    });
  }
}
