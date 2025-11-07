import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateDealDto,
  UpdateDealDto,
  UpdateDealStatusDto,
  DealFiltersDto,
} from './dto/create-deal.dto';
import { DealResponseDto, DealListResponseDto } from './dto/deal-response.dto';
import { DealStatus } from '@prisma/client';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new deal
   */
  async create(
    createDealDto: CreateDealDto,
    userId?: string,
  ): Promise<DealResponseDto> {
    // Validate merchant exists
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: createDealDto.merchantId },
    });

    if (!merchant) {
      throw new NotFoundException(
        `Merchant with ID ${createDealDto.merchantId} not found`,
      );
    }

    // Validate category if provided
    if (createDealDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: createDealDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createDealDto.categoryId} not found`,
        );
      }
    }

    // Validate dates
    const validFrom = new Date(createDealDto.validFrom);
    const validUntil = new Date(createDealDto.validUntil);

    if (validFrom >= validUntil) {
      throw new BadRequestException('validFrom must be before validUntil');
    }

    // Create deal
    const deal = await this.prisma.deal.create({
      data: {
        title: createDealDto.title,
        description: createDealDto.description,
        dealPrice: createDealDto.dealPrice,
        discountPrice: createDealDto.discountPrice,
        validFrom,
        validUntil,
        status: createDealDto.status || DealStatus.DRAFT,
        maxQuantity: createDealDto.maxQuantity,
        soldQuantity: 0,
        images: createDealDto.images || [],
        terms: createDealDto.terms,
        merchantId: createDealDto.merchantId,
        categoryId: createDealDto.categoryId,
      },
      include: {
        merchant: true,
        category: true,
      },
    });

    return this.mapDealToResponse(deal);
  }

  /**
   * Find all deals with filters and pagination
   */
  async findAll(filters: DealFiltersDto): Promise<DealListResponseDto> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.merchantId) {
      where.merchantId = filters.merchantId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filter by merchant city
    if (filters.city) {
      where.merchant = {
        ...where.merchant,
        city: { contains: filters.city, mode: 'insensitive' },
      };
    }

    // Filter by price range
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.dealPrice = {};
      if (filters.priceMin !== undefined) {
        where.dealPrice.gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        where.dealPrice.lte = filters.priceMax;
      }
    }

    // Filter for active deals only when status=active is specified
    if (filters.status === DealStatus.ACTIVE) {
      where.status = DealStatus.ACTIVE;
      where.validFrom = { lte: new Date() };
      where.validUntil = { gte: new Date() };
    }

    // Build order by clause - map frontend sort options to database fields
    const orderBy: any = {};
    if (filters.sortBy) {
      const sortField = filters.sortBy;
      const sortOrder = filters.sortOrder || 'desc';

      // Map frontend sort options to actual database fields
      switch (sortField) {
        case 'discountedPrice':
          // Frontend uses discountedPrice, but DB has dealPrice
          orderBy.dealPrice = sortOrder;
          break;
        case 'discountPercentage':
          // Can't sort by calculated field, use dealPrice instead
          orderBy.dealPrice = sortOrder === 'desc' ? 'asc' : 'desc'; // Lower price = higher discount
          break;
        case 'popularity':
          // Sort by number of orders (soldQuantity)
          orderBy.soldQuantity = sortOrder;
          break;
        default:
          // Use the field as-is (createdAt, etc)
          orderBy[sortField] = sortOrder;
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    // Fetch deals with pagination
    const [deals, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
              logo: true,
              address: true,
              city: true,
              province: true,
              phone: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              icon: true,
              color: true,
            },
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      this.prisma.deal.count({ where }),
    ]);

    return {
      deals: deals.map((deal) => this.mapDealToResponse(deal)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find deal by ID
   */
  async findOne(id: string): Promise<DealResponseDto> {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            email: true,
            logo: true,
            address: true,
            city: true,
            province: true,
            phone: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            color: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    return this.mapDealToResponse(deal);
  }

  /**
   * Find deal by slug (generated from title)
   */
  async findBySlug(slug: string): Promise<DealResponseDto> {
    // Since we don't have slug in DB yet, search by title match
    // You can add a slug field to the Deal model later
    const deals = await this.prisma.deal.findMany({
      where: {
        title: {
          contains: slug.replace(/-/g, ' '),
          mode: 'insensitive',
        },
      },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            email: true,
            logo: true,
            address: true,
            city: true,
            province: true,
            phone: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            color: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      take: 1,
    });

    if (!deals || deals.length === 0) {
      throw new NotFoundException(`Deal with slug ${slug} not found`);
    }

    return this.mapDealToResponse(deals[0]);
  }

  /**
   * Get active deals
   */
  async findActive(
    page: number = 1,
    limit: number = 12,
  ): Promise<DealListResponseDto> {
    return this.findAll({
      status: DealStatus.ACTIVE,
      page,
      limit,
    });
  }

  /**
   * Get deals by status
   */
  async findByStatus(
    status: DealStatus,
    page: number = 1,
    limit: number = 12,
  ): Promise<DealListResponseDto> {
    return this.findAll({
      status,
      page,
      limit,
    });
  }

  /**
   * Get deals by merchant
   */
  async findByMerchant(
    merchantId: string,
    page: number = 1,
    limit: number = 12,
  ): Promise<DealListResponseDto> {
    return this.findAll({
      merchantId,
      page,
      limit,
    });
  }

  /**
   * Get deals by category
   */
  async findByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 12,
  ): Promise<DealListResponseDto> {
    return this.findAll({
      categoryId,
      page,
      limit,
    });
  }

  /**
   * Update deal
   */
  async update(
    id: string,
    updateDealDto: UpdateDealDto,
    userId?: string,
  ): Promise<DealResponseDto> {
    // Check if deal exists
    const existingDeal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    // Validate category if provided
    if (updateDealDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateDealDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateDealDto.categoryId} not found`,
        );
      }
    }

    // Validate dates if provided
    if (updateDealDto.validFrom || updateDealDto.validUntil) {
      const validFrom = updateDealDto.validFrom
        ? new Date(updateDealDto.validFrom)
        : existingDeal.validFrom;
      const validUntil = updateDealDto.validUntil
        ? new Date(updateDealDto.validUntil)
        : existingDeal.validUntil;

      if (validFrom >= validUntil) {
        throw new BadRequestException('validFrom must be before validUntil');
      }
    }

    // Update deal
    const updated = await this.prisma.deal.update({
      where: { id },
      data: {
        ...(updateDealDto.title && { title: updateDealDto.title }),
        ...(updateDealDto.description !== undefined && {
          description: updateDealDto.description,
        }),
        ...(updateDealDto.dealPrice && { dealPrice: updateDealDto.dealPrice }),
        ...(updateDealDto.discountPrice && {
          discountPrice: updateDealDto.discountPrice,
        }),
        ...(updateDealDto.validFrom && {
          validFrom: new Date(updateDealDto.validFrom),
        }),
        ...(updateDealDto.validUntil && {
          validUntil: new Date(updateDealDto.validUntil),
        }),
        ...(updateDealDto.status && { status: updateDealDto.status }),
        ...(updateDealDto.maxQuantity !== undefined && {
          maxQuantity: updateDealDto.maxQuantity,
        }),
        ...(updateDealDto.images && { images: updateDealDto.images }),
        ...(updateDealDto.terms !== undefined && {
          terms: updateDealDto.terms,
        }),
        ...(updateDealDto.categoryId !== undefined && {
          categoryId: updateDealDto.categoryId,
        }),
      },
      include: {
        merchant: true,
        category: true,
      },
    });

    return this.mapDealToResponse(updated);
  }

  /**
   * Update deal status
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateDealStatusDto,
    userId?: string,
  ): Promise<DealResponseDto> {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    // Validate status transition
    this.validateStatusTransition(deal.status, updateStatusDto.status);

    const updated = await this.prisma.deal.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        merchant: true,
        category: true,
      },
    });

    return this.mapDealToResponse(updated);
  }

  /**
   * Publish deal (DRAFT -> ACTIVE)
   */
  async publish(id: string, userId?: string): Promise<DealResponseDto> {
    return this.updateStatus(id, { status: DealStatus.ACTIVE }, userId);
  }

  /**
   * Pause deal (ACTIVE -> PAUSED)
   */
  async pause(id: string, userId?: string): Promise<DealResponseDto> {
    return this.updateStatus(id, { status: DealStatus.PAUSED }, userId);
  }

  /**
   * Delete deal (soft delete by setting status to EXPIRED)
   */
  async remove(id: string, userId?: string): Promise<void> {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    // Soft delete by setting status to EXPIRED
    await this.prisma.deal.update({
      where: { id },
      data: { status: DealStatus.EXPIRED },
    });
  }

  /**
   * Check and update expired deals
   */
  async checkExpiredDeals(): Promise<{ updated: number }> {
    const now = new Date();

    const result = await this.prisma.deal.updateMany({
      where: {
        status: DealStatus.ACTIVE,
        validUntil: { lt: now },
      },
      data: {
        status: DealStatus.EXPIRED,
      },
    });

    return { updated: result.count };
  }

  /**
   * Check and update sold out deals
   */
  async checkSoldOutDeals(): Promise<{ updated: number }> {
    const deals = await this.prisma.deal.findMany({
      where: {
        status: DealStatus.ACTIVE,
        maxQuantity: { not: null },
      },
      select: {
        id: true,
        maxQuantity: true,
        soldQuantity: true,
      },
    });

    let updated = 0;

    for (const deal of deals) {
      if (deal.maxQuantity && deal.soldQuantity >= deal.maxQuantity) {
        await this.prisma.deal.update({
          where: { id: deal.id },
          data: { status: DealStatus.SOLD_OUT },
        });
        updated++;
      }
    }

    return { updated };
  }

  /**
   * Get deal statistics
   */
  async getStats() {
    const [total, active, draft, paused, expired, soldOut] = await Promise.all([
      this.prisma.deal.count(),
      this.prisma.deal.count({ where: { status: DealStatus.ACTIVE } }),
      this.prisma.deal.count({ where: { status: DealStatus.DRAFT } }),
      this.prisma.deal.count({ where: { status: DealStatus.PAUSED } }),
      this.prisma.deal.count({ where: { status: DealStatus.EXPIRED } }),
      this.prisma.deal.count({ where: { status: DealStatus.SOLD_OUT } }),
    ]);

    return {
      total,
      active,
      draft,
      paused,
      expired,
      soldOut,
    };
  }

  /**
   * Helper: Validate status transition
   */
  private validateStatusTransition(
    currentStatus: DealStatus,
    newStatus: DealStatus,
  ): void {
    const allowedTransitions: Record<DealStatus, DealStatus[]> = {
      [DealStatus.DRAFT]: [DealStatus.ACTIVE],
      [DealStatus.ACTIVE]: [
        DealStatus.PAUSED,
        DealStatus.EXPIRED,
        DealStatus.SOLD_OUT,
      ],
      [DealStatus.PAUSED]: [DealStatus.ACTIVE, DealStatus.EXPIRED],
      [DealStatus.EXPIRED]: [],
      [DealStatus.SOLD_OUT]: [],
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  /**
   * Helper: Map Deal entity to response DTO
   */
  private mapDealToResponse(deal: any): DealResponseDto {
    const quantityAvailable = deal.maxQuantity
      ? deal.maxQuantity - deal.soldQuantity
      : 999999;
    const dealPriceValue = Number(deal.dealPrice);
    const discountPriceValue = Number(deal.discountPrice);

    // Calculate REAL discount percentage from actual prices
    const realDiscountPercentage =
      discountPriceValue > 0
        ? Math.round(
            ((discountPriceValue - dealPriceValue) / discountPriceValue) * 100,
          )
        : 0;

    const slug = this.generateSlug(deal.title, deal.id);
    const firstImage =
      deal.images && deal.images.length > 0 ? deal.images[0] : '';
    const shortDescription = deal.description
      ? deal.description.substring(0, 150) +
        (deal.description.length > 150 ? '...' : '')
      : null;

    // Extract highlights from description (if available)
    const highlights: string[] = [];
    if (deal.terms) {
      const termLines = deal.terms
        .split('.')
        .filter((t) => t.trim().length > 0);
      termLines.forEach((line) => {
        if (line.trim().length > 10 && line.trim().length < 100) {
          highlights.push(line.trim());
        }
      });
    }

    return {
      id: deal.id,
      slug,
      title: deal.title,
      description: deal.description,
      shortDescription,
      dealPrice: dealPriceValue, // What customer pays
      discountPrice: discountPriceValue, // Voucher face value
      discountedPrice: discountPriceValue, // Same as discountPrice
      originalPrice: discountPriceValue, // Voucher face value
      discountPercentage: realDiscountPercentage, // REAL calculated percentage
      images: deal.images || [],
      thumbnailUrl: firstImage,
      validFrom: deal.validFrom,
      validUntil: deal.validUntil,
      redemptionDeadline: deal.validUntil,
      status: deal.status,
      type: 'voucher',
      featured: false,
      maxQuantity: deal.maxQuantity,
      soldQuantity: deal.soldQuantity,
      quantityAvailable,
      quantity: deal.maxQuantity || 999999,
      terms: deal.terms,
      highlights: highlights.length > 0 ? highlights : undefined,
      merchantId: deal.merchantId,
      merchant: deal.merchant
        ? {
            id: deal.merchant.id,
            businessName: deal.merchant.name,
            slug: this.generateSlug(deal.merchant.name, deal.merchant.id),
            logoUrl: deal.merchant.logo,
            address: deal.merchant.address,
            city: deal.merchant.city,
            province: deal.merchant.province,
            phone: deal.merchant.phone,
          }
        : undefined,
      categoryId: deal.categoryId,
      category: deal.category
        ? {
            id: deal.category.id,
            name: deal.category.name,
            slug: this.generateSlug(deal.category.name, deal.category.id),
            color: deal.category.color,
          }
        : undefined,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
      _count: deal._count,
    };
  }

  /**
   * Helper: Generate slug from title
   */
  private generateSlug(title: string, id: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return `${slug}-${id.slice(-8)}`;
  }
}
