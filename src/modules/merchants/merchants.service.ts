import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { MerchantVerificationDto, VerificationStatus } from './dto/merchant-verification.dto';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  async create(createMerchantDto: CreateMerchantDto, userId: string) {
    // Check if merchant with this email already exists
    const existingMerchant = await this.prisma.merchant.findUnique({
      where: { email: createMerchantDto.email },
    });

    if (existingMerchant) {
      throw new BadRequestException('Merchant with this email already exists');
    }

    // Create merchant with operating hours
    const { operatingHours, ...merchantData } = createMerchantDto;

    const merchant = await this.prisma.merchant.create({
      data: {
        ...merchantData,
        images: merchantData.images || [],
        // Store operating hours as JSON in a custom field
        // Note: In a real app, you might want a separate OperatingHours table
      },
    });

    return this.findOne(merchant.id);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, city?: string, isActive?: boolean) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [merchants, total] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              deals: true,
            },
          },
        },
      }),
      this.prisma.merchant.count({ where }),
    ]);

    // Add statistics to each merchant
    const merchantsWithStats = await Promise.all(
      merchants.map(async (merchant) => {
        const activeDeals = await this.prisma.deal.count({
          where: {
            merchantId: merchant.id,
            status: 'ACTIVE',
          },
        });

        const totalOrders = await this.prisma.order.count({
          where: {
            deal: {
              merchantId: merchant.id,
            },
          },
        });

        return {
          ...merchant,
          totalDeals: merchant._count.deals,
          activeDeals,
          totalOrders,
        };
      })
    );

    return {
      data: merchantsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            deals: true,
          },
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Add statistics
    const activeDeals = await this.prisma.deal.count({
      where: {
        merchantId: merchant.id,
        status: 'ACTIVE',
      },
    });

    const totalOrders = await this.prisma.order.count({
      where: {
        deal: {
          merchantId: merchant.id,
        },
      },
    });

    return {
      ...merchant,
      totalDeals: merchant._count.deals,
      activeDeals,
      totalOrders,
    };
  }

  async findByEmail(email: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            deals: true,
          },
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return this.findOne(merchant.id);
  }

  async update(id: string, updateMerchantDto: UpdateMerchantDto, userId: string) {
    const merchant = await this.findOne(id);
    
    // Check if user owns this merchant (in a real app, you'd have proper ownership logic)
    // For now, we'll allow updates if the user email matches the merchant email
    if (merchant.email !== userId) {
      throw new ForbiddenException('You can only update your own merchant profile');
    }

    // Check if email is being changed and if it's already taken
    if (updateMerchantDto.email && updateMerchantDto.email !== merchant.email) {
      const existingMerchant = await this.prisma.merchant.findUnique({
        where: { email: updateMerchantDto.email },
      });

      if (existingMerchant) {
        throw new BadRequestException('Email is already taken by another merchant');
      }
    }

    const { operatingHours, ...merchantData } = updateMerchantDto;

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id },
      data: {
        ...merchantData,
        // Update operating hours if provided
        // Note: In a real app, you might want to handle this differently
      },
    });

    return this.findOne(updatedMerchant.id);
  }

  async remove(id: string, userId: string) {
    const merchant = await this.findOne(id);
    
    // Check if user owns this merchant
    if (merchant.email !== userId) {
      throw new ForbiddenException('You can only delete your own merchant profile');
    }

    // Check if merchant has active deals
    const activeDeals = await this.prisma.deal.count({
      where: {
        merchantId: id,
        status: 'ACTIVE',
      },
    });

    if (activeDeals > 0) {
      throw new BadRequestException('Cannot delete merchant with active deals. Please deactivate or delete all active deals first.');
    }

    return this.prisma.merchant.delete({
      where: { id },
    });
  }

  // Merchant verification methods
  async updateVerificationStatus(id: string, verificationDto: MerchantVerificationDto, adminId: string) {
    const merchant = await this.findOne(id);

    // In a real app, you'd store verification data in a separate table
    // For now, we'll just update the merchant's active status based on verification
    const isActive = verificationDto.status === VerificationStatus.VERIFIED;

    return this.prisma.merchant.update({
      where: { id },
      data: {
        isActive,
        // In a real app, you'd also store verification data
      },
    });
  }

  async getVerificationStatus(id: string) {
    const merchant = await this.findOne(id);
    
    // In a real app, you'd fetch this from a verification table
    // For now, we'll return a mock status based on isActive
    return {
      merchantId: id,
      status: merchant.isActive ? VerificationStatus.VERIFIED : VerificationStatus.PENDING,
      verifiedAt: merchant.isActive ? merchant.createdAt : null,
      notes: merchant.isActive ? 'Merchant is active and verified' : 'Verification pending',
    };
  }

  // Business profile management
  async updateOperatingHours(id: string, operatingHours: any[], userId: string) {
    const merchant = await this.findOne(id);
    
    // Check if user owns this merchant
    if (merchant.email !== userId) {
      throw new ForbiddenException('You can only update your own merchant profile');
    }

    // In a real app, you'd store this in a separate operating hours table
    // For now, we'll just return the merchant with updated hours
    return {
      ...merchant,
      operatingHours,
    };
  }

  async getOperatingHours(id: string) {
    const merchant = await this.findOne(id);
    
    // In a real app, you'd fetch this from an operating hours table
    // For now, we'll return mock data
    return {
      merchantId: id,
      operatingHours: [
        { day: 'monday', openTime: '09:00', closeTime: '22:00', isOpen: true },
        { day: 'tuesday', openTime: '09:00', closeTime: '22:00', isOpen: true },
        { day: 'wednesday', openTime: '09:00', closeTime: '22:00', isOpen: true },
        { day: 'thursday', openTime: '09:00', closeTime: '22:00', isOpen: true },
        { day: 'friday', openTime: '09:00', closeTime: '22:00', isOpen: true },
        { day: 'saturday', openTime: '10:00', closeTime: '23:00', isOpen: true },
        { day: 'sunday', openTime: '10:00', closeTime: '21:00', isOpen: true },
      ],
    };
  }

  // Statistics and analytics
  async getMerchantStats(id: string) {
    const merchant = await this.findOne(id);

    const [
      totalDeals,
      activeDeals,
      totalOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      this.prisma.deal.count({
        where: { merchantId: id },
      }),
      this.prisma.deal.count({
        where: { merchantId: id, status: 'ACTIVE' },
      }),
      this.prisma.order.count({
        where: {
          deal: { merchantId: id },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          deal: { merchantId: id },
          status: 'PAID',
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.findMany({
        where: {
          deal: { merchantId: id },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          deal: true,
          customer: true,
        },
      }),
    ]);

    return {
      merchantId: id,
      totalDeals,
      activeDeals,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders,
    };
  }

  // Search and filtering
  async searchMerchants(query: string, filters: any = {}) {
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { province: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Apply additional filters
    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.merchant.findMany({
      where,
      include: {
        _count: {
          select: {
            deals: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Deactivate merchant (soft delete)
  async deactivate(id: string, userId: string) {
    const merchant = await this.findOne(id);
    
    // Check if user owns this merchant
    if (merchant.email !== userId) {
      throw new ForbiddenException('You can only deactivate your own merchant profile');
    }

    return this.prisma.merchant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Reactivate merchant
  async reactivate(id: string, userId: string) {
    const merchant = await this.findOne(id);
    
    // Check if user owns this merchant
    if (merchant.email !== userId) {
      throw new ForbiddenException('You can only reactivate your own merchant profile');
    }

    return this.prisma.merchant.update({
      where: { id },
      data: { isActive: true },
    });
  }
}



