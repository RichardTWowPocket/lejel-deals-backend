import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerStatsDto } from './dto/customer-stats.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, userId: string) {
    // Check if customer with this email already exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new BadRequestException('Customer with this email already exists');
    }

    // Set default preferences if not provided
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
        preferences: (createCustomerDto.preferences ||
          defaultPreferences) as any,
      },
    });

    return this.findOne(customer.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

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

    // Add statistics to each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const stats = await this.calculateCustomerStats(customer.id);
        return {
          ...customer,
          ...stats,
        };
      }),
    );

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

  async findOne(id: string) {
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
      throw new NotFoundException('Customer not found');
    }

    // Add statistics
    const stats = await this.calculateCustomerStats(customer.id);
    return {
      ...customer,
      ...stats,
    };
  }

  async findByEmail(email: string) {
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
      throw new NotFoundException('Customer not found');
    }

    return this.findOne(customer.id);
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    userId: string,
  ) {
    const customer = await this.findOne(id);

    // Check if user owns this customer profile (in a real app, you'd have proper ownership logic)
    if (customer.email !== userId) {
      throw new ForbiddenException(
        'You can only update your own customer profile',
      );
    }

    // Check if email is being changed and if it's already taken
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer) {
        throw new BadRequestException(
          'Email is already taken by another customer',
        );
      }
    }

    const { metadata, ...updateData } = updateCustomerDto;
    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: {
        ...updateData,
        preferences: updateCustomerDto.preferences as any,
      },
    });

    return this.findOne(updatedCustomer.id);
  }

  async remove(id: string, userId: string) {
    const customer = await this.findOne(id);

    // Check if user owns this customer profile
    if (customer.email !== userId) {
      throw new ForbiddenException(
        'You can only delete your own customer profile',
      );
    }

    // Check if customer has active orders
    const activeOrders = await this.prisma.order.count({
      where: {
        customerId: id,
        status: 'PENDING',
      },
    });

    if (activeOrders > 0) {
      throw new BadRequestException(
        'Cannot delete customer with active orders. Please complete or cancel all pending orders first.',
      );
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  // Customer statistics and analytics
  async getCustomerStats(id: string): Promise<CustomerStatsDto> {
    const customer = await this.findOne(id);
    const stats = await this.calculateCustomerStats(id);
    return {
      customerId: id,
      ...stats,
    } as CustomerStatsDto;
  }

  private async calculateCustomerStats(
    customerId: string,
  ): Promise<Partial<CustomerStatsDto>> {
    const [
      totalOrders,
      totalSpent,
      lastOrder,
      firstOrder,
      activeDeals,
      usedDeals,
      favoriteCategories,
    ] = await Promise.all([
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
    const averageOrderValue =
      totalOrders > 0 ? totalSpentAmount / totalOrders : 0;
    const daysSinceLastOrder = lastOrder
      ? Math.floor(
          (Date.now() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

    // Calculate customer tier based on total spent
    const tier = this.calculateCustomerTier(totalSpentAmount);
    const loyaltyPoints = Math.floor(totalSpentAmount / 1000); // 1 point per 1000 IDR

    // Calculate total savings (this would need to be calculated from deal discounts)
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

  private async getFavoriteCategories(customerId: string): Promise<string[]> {
    // Get categories from customer's orders
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

    const categoryCount: Record<string, number> = {};
    orderCategories.forEach((order) => {
      if (order.deal.category) {
        const categoryName = order.deal.category.name;
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      }
    });

    // Return top 3 categories
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  private calculateCustomerTier(totalSpent: number): string {
    if (totalSpent >= 5000000) return 'Platinum';
    if (totalSpent >= 2000000) return 'Gold';
    if (totalSpent >= 500000) return 'Silver';
    return 'Bronze';
  }

  private async calculateTotalSavings(customerId: string): Promise<number> {
    // This would calculate total savings from deals
    // For now, we'll return a mock value
    return 0;
  }

  // Search and filtering
  async searchCustomers(query: string, filters: any = {}) {
    const where: any = {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Apply additional filters
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

  // Customer preferences management
  async updatePreferences(id: string, preferences: any, userId: string) {
    const customer = await this.findOne(id);

    // Check if user owns this customer profile
    if (customer.email !== userId) {
      throw new ForbiddenException('You can only update your own preferences');
    }

    return this.prisma.customer.update({
      where: { id },
      data: { preferences: preferences },
    });
  }

  async getPreferences(id: string) {
    const customer = await this.findOne(id);
    return {
      customerId: id,
      preferences: customer.preferences,
    };
  }

  // Customer activation/deactivation
  async deactivate(id: string, userId: string) {
    const customer = await this.findOne(id);

    // Check if user owns this customer profile
    if (customer.email !== userId) {
      throw new ForbiddenException(
        'You can only deactivate your own customer profile',
      );
    }

    return this.prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async reactivate(id: string, userId: string) {
    const customer = await this.findOne(id);

    // Check if user owns this customer profile
    if (customer.email !== userId) {
      throw new ForbiddenException(
        'You can only reactivate your own customer profile',
      );
    }

    return this.prisma.customer.update({
      where: { id },
      data: { isActive: true },
    });
  }

  // Customer analytics and insights
  async getCustomerInsights(id: string) {
    const customer = await this.findOne(id);
    const stats = await this.calculateCustomerStats(id);

    // Get recent orders
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

    // Get active coupons
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
        name:
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
          'Unknown',
        email: customer.email,
        tier: stats.tier,
        loyaltyPoints: stats.loyaltyPoints,
      },
      stats,
      recentOrders,
      activeCoupons,
    };
  }

  // Get top customers by spending
  async getTopCustomers(limit: number = 10) {
    const customers = await this.prisma.customer.findMany({
      include: {
        orders: {
          where: { status: 'PAID' },
        },
      },
    });

    const customersWithSpending = customers.map((customer) => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      );
      return {
        ...customer,
        totalSpent,
      };
    });

    return customersWithSpending
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }
}
