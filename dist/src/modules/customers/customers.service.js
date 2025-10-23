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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCustomerDto, userId) {
        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email: createCustomerDto.email },
        });
        if (existingCustomer) {
            throw new common_1.BadRequestException('Customer with this email already exists');
        }
        const defaultPreferences = {
            email: true,
            sms: true,
            push: true,
            whatsapp: false,
            deals: true,
            orders: true,
            marketing: false,
        };
        const { metadata, ...customerData } = createCustomerDto;
        const customer = await this.prisma.customer.create({
            data: {
                ...customerData,
                preferences: (createCustomerDto.preferences || defaultPreferences),
            },
        });
        return this.findOne(customer.id);
    }
    async findAll(page = 1, limit = 10, search, isActive) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        const [customers, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            orders: true,
                        },
                    },
                },
            }),
            this.prisma.customer.count({ where }),
        ]);
        const customersWithStats = await Promise.all(customers.map(async (customer) => {
            const stats = await this.calculateCustomerStats(customer.id);
            return {
                ...customer,
                ...stats,
            };
        }));
        return {
            data: customersWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const stats = await this.calculateCustomerStats(customer.id);
        return {
            ...customer,
            ...stats,
        };
    }
    async findByEmail(email) {
        const customer = await this.prisma.customer.findUnique({
            where: { email },
            include: {
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return this.findOne(customer.id);
    }
    async update(id, updateCustomerDto, userId) {
        const customer = await this.findOne(id);
        if (customer.email !== userId) {
            throw new common_1.ForbiddenException('You can only update your own customer profile');
        }
        if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
            const existingCustomer = await this.prisma.customer.findUnique({
                where: { email: updateCustomerDto.email },
            });
            if (existingCustomer) {
                throw new common_1.BadRequestException('Email is already taken by another customer');
            }
        }
        const { metadata, ...updateData } = updateCustomerDto;
        const updatedCustomer = await this.prisma.customer.update({
            where: { id },
            data: {
                ...updateData,
                preferences: updateCustomerDto.preferences,
            },
        });
        return this.findOne(updatedCustomer.id);
    }
    async remove(id, userId) {
        const customer = await this.findOne(id);
        if (customer.email !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own customer profile');
        }
        const activeOrders = await this.prisma.order.count({
            where: {
                customerId: id,
                status: 'PENDING',
            },
        });
        if (activeOrders > 0) {
            throw new common_1.BadRequestException('Cannot delete customer with active orders. Please complete or cancel all pending orders first.');
        }
        return this.prisma.customer.delete({
            where: { id },
        });
    }
    async getCustomerStats(id) {
        const customer = await this.findOne(id);
        const stats = await this.calculateCustomerStats(id);
        return {
            customerId: id,
            ...stats,
        };
    }
    async calculateCustomerStats(customerId) {
        const [totalOrders, totalSpent, lastOrder, firstOrder, activeDeals, usedDeals, favoriteCategories,] = await Promise.all([
            this.prisma.order.count({
                where: { customerId },
            }),
            this.prisma.order.aggregate({
                where: {
                    customerId,
                    status: 'PAID',
                },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.findFirst({
                where: { customerId },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.findFirst({
                where: { customerId },
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.coupon.count({
                where: {
                    order: { customerId },
                    status: 'ACTIVE',
                },
            }),
            this.prisma.coupon.count({
                where: {
                    order: { customerId },
                    status: 'USED',
                },
            }),
            this.getFavoriteCategories(customerId),
        ]);
        const totalSpentAmount = Number(totalSpent._sum.totalAmount || 0);
        const averageOrderValue = totalOrders > 0 ? totalSpentAmount / totalOrders : 0;
        const daysSinceLastOrder = lastOrder ?
            Math.floor((Date.now() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        const tier = this.calculateCustomerTier(totalSpentAmount);
        const loyaltyPoints = Math.floor(totalSpentAmount / 1000);
        const totalSavings = await this.calculateTotalSavings(customerId);
        return {
            totalOrders,
            totalSpent: totalSpentAmount,
            averageOrderValue,
            lastOrderDate: lastOrder?.createdAt,
            firstOrderDate: firstOrder?.createdAt,
            activeDeals,
            usedDeals,
            favoriteCategories,
            tier,
            loyaltyPoints,
            daysSinceLastOrder,
            totalSavings,
        };
    }
    async getFavoriteCategories(customerId) {
        const orderCategories = await this.prisma.order.findMany({
            where: { customerId },
            include: {
                deal: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        const categoryCount = {};
        orderCategories.forEach(order => {
            if (order.deal.category) {
                const categoryName = order.deal.category.name;
                categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
            }
        });
        return Object.entries(categoryCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([category]) => category);
    }
    calculateCustomerTier(totalSpent) {
        if (totalSpent >= 5000000)
            return 'Platinum';
        if (totalSpent >= 2000000)
            return 'Gold';
        if (totalSpent >= 500000)
            return 'Silver';
        return 'Bronze';
    }
    async calculateTotalSavings(customerId) {
        return 0;
    }
    async searchCustomers(query, filters = {}) {
        const where = {
            OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
            ],
        };
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        return this.prisma.customer.findMany({
            where,
            include: {
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updatePreferences(id, preferences, userId) {
        const customer = await this.findOne(id);
        if (customer.email !== userId) {
            throw new common_1.ForbiddenException('You can only update your own preferences');
        }
        return this.prisma.customer.update({
            where: { id },
            data: { preferences: preferences },
        });
    }
    async getPreferences(id) {
        const customer = await this.findOne(id);
        return {
            customerId: id,
            preferences: customer.preferences,
        };
    }
    async deactivate(id, userId) {
        const customer = await this.findOne(id);
        if (customer.email !== userId) {
            throw new common_1.ForbiddenException('You can only deactivate your own customer profile');
        }
        return this.prisma.customer.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async reactivate(id, userId) {
        const customer = await this.findOne(id);
        if (customer.email !== userId) {
            throw new common_1.ForbiddenException('You can only reactivate your own customer profile');
        }
        return this.prisma.customer.update({
            where: { id },
            data: { isActive: true },
        });
    }
    async getCustomerInsights(id) {
        const customer = await this.findOne(id);
        const stats = await this.calculateCustomerStats(id);
        const recentOrders = await this.prisma.order.findMany({
            where: { customerId: id },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                deal: {
                    include: {
                        merchant: true,
                        category: true,
                    },
                },
            },
        });
        const activeCoupons = await this.prisma.coupon.findMany({
            where: {
                order: { customerId: id },
                status: 'ACTIVE',
            },
            include: {
                deal: {
                    include: {
                        merchant: true,
                    },
                },
            },
        });
        return {
            customer: {
                id: customer.id,
                name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown',
                email: customer.email,
                tier: stats.tier,
                loyaltyPoints: stats.loyaltyPoints,
            },
            stats,
            recentOrders,
            activeCoupons,
        };
    }
    async getTopCustomers(limit = 10) {
        const customers = await this.prisma.customer.findMany({
            include: {
                orders: {
                    where: { status: 'PAID' },
                },
            },
        });
        const customersWithSpending = customers.map(customer => {
            const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            return {
                ...customer,
                totalSpent,
            };
        });
        return customersWithSpending
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, limit);
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map