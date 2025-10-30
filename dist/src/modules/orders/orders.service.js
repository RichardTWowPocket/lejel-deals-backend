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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto, userId) {
        const { customerId, dealId, quantity, paymentMethod, paymentReference } = createOrderDto;
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId, isActive: true },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found or inactive');
        }
        const deal = await this.prisma.deal.findUnique({
            where: { id: dealId },
            include: {
                merchant: true,
            },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        if (deal.status !== client_1.DealStatus.ACTIVE) {
            throw new common_1.BadRequestException('Deal is not active');
        }
        const now = new Date();
        if (now < deal.validFrom || now > deal.validUntil) {
            throw new common_1.BadRequestException('Deal is not within valid period');
        }
        if (deal.maxQuantity && (deal.soldQuantity + quantity) > deal.maxQuantity) {
            throw new common_1.BadRequestException('Insufficient quantity available');
        }
        const totalAmount = new library_1.Decimal(deal.discountPrice).mul(quantity);
        const orderNumber = await this.generateOrderNumber();
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                customerId,
                dealId,
                quantity,
                totalAmount,
                status: client_1.OrderStatus.PENDING,
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
    async findAll(page = 1, limit = 10, status, customerId, dealId, merchantId) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (customerId)
            where.customerId = customerId;
        if (dealId)
            where.dealId = dealId;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return this.mapToOrderResponseDto(order);
    }
    async findByOrderNumber(orderNumber) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return this.mapToOrderResponseDto(order);
    }
    async findByCustomer(customerId, page = 1, limit = 10) {
        const result = await this.findAll(page, limit, undefined, customerId);
        return result;
    }
    async findByMerchant(merchantId, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, undefined, undefined, merchantId);
    }
    async findMine(userId, page = 1, limit = 10) {
        const customer = await this.prisma.customer.findFirst({ where: { userId: userId } });
        if (!customer) {
            return {
                orders: [],
                pagination: { page, limit, total: 0, totalPages: 0 },
            };
        }
        return this.findByCustomer(customer.id, page, limit);
    }
    async update(id, updateOrderDto) {
        const existingOrder = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!existingOrder) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (updateOrderDto.status && !this.isValidStatusTransition(existingOrder.status, updateOrderDto.status)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${existingOrder.status} to ${updateOrderDto.status}`);
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
    async updateStatus(id, updateStatusDto) {
        const { status, paymentReference } = updateStatusDto;
        const existingOrder = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!existingOrder) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (!this.isValidStatusTransition(existingOrder.status, status)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${existingOrder.status} to ${status}`);
        }
        if (status === client_1.OrderStatus.PAID && !paymentReference) {
            throw new common_1.BadRequestException('Payment reference is required when marking order as paid');
        }
        const updateData = { status };
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
    async cancel(id, reason) {
        const existingOrder = await this.prisma.order.findUnique({
            where: { id },
            include: { deal: true },
        });
        if (!existingOrder) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (existingOrder.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending orders can be cancelled');
        }
        const order = await this.prisma.order.update({
            where: { id },
            data: {
                status: client_1.OrderStatus.CANCELLED,
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
    async refund(id, reason) {
        const existingOrder = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!existingOrder) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (existingOrder.status !== client_1.OrderStatus.PAID) {
            throw new common_1.BadRequestException('Only paid orders can be refunded');
        }
        const order = await this.prisma.order.update({
            where: { id },
            data: {
                status: client_1.OrderStatus.REFUNDED,
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
    async remove(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== client_1.OrderStatus.CANCELLED && order.status !== client_1.OrderStatus.REFUNDED) {
            throw new common_1.BadRequestException('Only cancelled or refunded orders can be deleted');
        }
        await this.prisma.order.delete({
            where: { id },
        });
    }
    async getStats() {
        const [totalOrders, pendingOrders, paidOrders, cancelledOrders, refundedOrders, totalRevenue, averageOrderValue,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: client_1.OrderStatus.PENDING } }),
            this.prisma.order.count({ where: { status: client_1.OrderStatus.PAID } }),
            this.prisma.order.count({ where: { status: client_1.OrderStatus.CANCELLED } }),
            this.prisma.order.count({ where: { status: client_1.OrderStatus.REFUNDED } }),
            this.prisma.order.aggregate({
                where: { status: client_1.OrderStatus.PAID },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.aggregate({
                where: { status: client_1.OrderStatus.PAID },
                _avg: { totalAmount: true },
            }),
        ]);
        const statusDistribution = {
            [client_1.OrderStatus.PENDING]: pendingOrders,
            [client_1.OrderStatus.PAID]: paidOrders,
            [client_1.OrderStatus.CANCELLED]: cancelledOrders,
            [client_1.OrderStatus.REFUNDED]: refundedOrders,
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
    async getAnalytics(period = 'month') {
        const now = new Date();
        let startDate;
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
        const ordersByPeriod = await this.prisma.order.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: { gte: startDate },
            },
            _count: { id: true },
            _sum: { totalAmount: true },
        });
        const topCustomers = await this.prisma.order.groupBy({
            by: ['customerId'],
            where: {
                createdAt: { gte: startDate },
                status: client_1.OrderStatus.PAID,
            },
            _count: { id: true },
            _sum: { totalAmount: true },
            orderBy: { _sum: { totalAmount: 'desc' } },
            take: 10,
        });
        const topDeals = await this.prisma.order.groupBy({
            by: ['dealId'],
            where: {
                createdAt: { gte: startDate },
                status: client_1.OrderStatus.PAID,
            },
            _count: { id: true },
            _sum: { totalAmount: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });
        const totalOrdersInPeriod = await this.prisma.order.count({
            where: { createdAt: { gte: startDate } },
        });
        const completedOrdersInPeriod = await this.prisma.order.count({
            where: {
                createdAt: { gte: startDate },
                status: client_1.OrderStatus.PAID,
            },
        });
        const completionRate = totalOrdersInPeriod > 0 ? (completedOrdersInPeriod / totalOrdersInPeriod) * 100 : 0;
        const paidOrders = await this.prisma.order.findMany({
            where: {
                status: client_1.OrderStatus.PAID,
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
                return sum + (timeDiff / (1000 * 60 * 60));
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
    async generateOrderNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const startOfMonth = new Date(year, new Date().getMonth(), 1);
        const count = await this.prisma.order.count({
            where: {
                createdAt: { gte: startOfMonth },
            },
        });
        const orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(3, '0')}`;
        return orderNumber;
    }
    isValidStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [client_1.OrderStatus.PENDING]: [client_1.OrderStatus.PAID, client_1.OrderStatus.CANCELLED],
            [client_1.OrderStatus.PAID]: [client_1.OrderStatus.REFUNDED],
            [client_1.OrderStatus.CANCELLED]: [],
            [client_1.OrderStatus.REFUNDED]: [],
        };
        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }
    mapToOrderResponseDto(order) {
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
                finalPrice: Number(order.deal.discountPrice),
            } : undefined,
            coupons: order.coupons,
        };
    }
    formatPeriodData(data, period, type = 'orders') {
        const result = {};
        data.forEach(item => {
            const date = new Date(item.createdAt);
            let key;
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
            }
            else {
                result[key] = (result[key] || 0) + item._count.id;
            }
        });
        return result;
    }
    async enrichTopCustomers(customers) {
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
    async enrichTopDeals(deals) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map