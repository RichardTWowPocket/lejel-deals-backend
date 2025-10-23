import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTreeNodeDto } from './dto/category-tree.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category with this name already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    // Validate parent category if provided
    let parentCategory: any = null;
    if (createCategoryDto.parentId) {
      parentCategory = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }

      if (!parentCategory.isActive) {
        throw new BadRequestException('Cannot create subcategory under inactive parent category');
      }
    }

    // Calculate hierarchy information
    const level = parentCategory ? parentCategory.level + 1 : 0;
    const path = await this.generateCategoryPath(createCategoryDto.parentId || null, createCategoryDto.name);
    
    // Get next sort order for this level
    const nextSortOrder = await this.getNextSortOrder(createCategoryDto.parentId || null);

    const { tags, metadata, ...categoryData } = createCategoryDto;

    const category = await this.prisma.category.create({
      data: {
        ...categoryData,
        level,
        path,
        sortOrder: createCategoryDto.sortOrder ?? nextSortOrder,
        tags: tags || [],
        metadata: metadata as any,
      },
    });

    return this.findOne(category.id);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, isActive?: boolean, parentId?: string | null, level?: number) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { name: 'asc' },
        ],
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            deals: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Add statistics
    const stats = await this.calculateCategoryStats(category.id);
    const children = await this.getChildCategories(category.id);

    return {
      ...category,
      ...stats,
      children,
    };
  }

  async findByName(name: string) {
    const category = await this.prisma.category.findUnique({
      where: { name },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            deals: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.findOne(category.id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    // Check if name is being changed and if it's already taken
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category name is already taken');
      }
    }

    // Validate parent category if being changed
    if (updateCategoryDto.parentId !== undefined && updateCategoryDto.parentId !== category.parentId) {
      if (updateCategoryDto.parentId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: { id: updateCategoryDto.parentId },
        });

        if (!parentCategory) {
          throw new NotFoundException('Parent category not found');
        }

        if (!parentCategory.isActive) {
          throw new BadRequestException('Cannot set inactive category as parent');
        }

        // Check for circular reference
        if (updateCategoryDto.parentId === id) {
          throw new BadRequestException('Category cannot be its own parent');
        }

        // Check if the new parent is a descendant of this category
        const isDescendant = await this.isDescendant(id, updateCategoryDto.parentId);
        if (isDescendant) {
          throw new BadRequestException('Cannot set descendant category as parent');
        }
      }
    }

    const { tags, metadata, ...categoryData } = updateCategoryDto;

    // Recalculate hierarchy if parent is changing
    let updateData = { ...categoryData };
    if (updateCategoryDto.parentId !== undefined) {
      const parent = updateCategoryDto.parentId ? 
        await this.prisma.category.findUnique({ where: { id: updateCategoryDto.parentId } }) : null;
      const newLevel = parent ? parent.level + 1 : 0;
      const newPath = await this.generateCategoryPath(updateCategoryDto.parentId || null, updateCategoryDto.name || category.name);
      
      updateData = {
        ...updateData,
        level: newLevel,
        path: newPath,
      };
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...updateData,
        tags: tags as any,
        metadata: metadata as any,
      },
    });

    return this.findOne(updatedCategory.id);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Check if category has child categories
    const childCategories = await this.prisma.category.count({
      where: { parentId: id },
    });

    if (childCategories > 0) {
      throw new BadRequestException('Cannot delete category with child categories. Please delete or move child categories first.');
    }

    // Check if category has active deals
    const activeDeals = await this.prisma.deal.count({
      where: {
        categoryId: id,
        status: 'ACTIVE',
      },
    });

    if (activeDeals > 0) {
      throw new BadRequestException('Cannot delete category with active deals. Please deactivate or move deals first.');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  // Category hierarchy management
  async getCategoryTree(): Promise<CategoryTreeNodeDto[]> {
    const rootCategories = await this.prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    const tree = await Promise.all(
      rootCategories.map(category => this.buildCategoryTreeNode(category.id))
    );

    return tree;
  }

  private async buildCategoryTreeNode(categoryId: string, level: number = 0): Promise<CategoryTreeNodeDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            deals: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const stats = await this.calculateCategoryStats(categoryId);
    const children = await this.prisma.category.findMany({
      where: {
        parentId: categoryId,
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    const childNodes = await Promise.all(
      children.map(child => this.buildCategoryTreeNode(child.id, level + 1))
    );

    return {
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      icon: category.icon || undefined,
      color: category.color || undefined,
      parentId: category.parentId || undefined,
      level: category.level,
      path: category.path || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      totalDeals: stats.totalDeals,
      activeDeals: stats.activeDeals,
      children: childNodes,
    };
  }

  async getChildCategories(parentId: string) {
    const children = await this.prisma.category.findMany({
      where: { parentId },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            deals: true,
            children: true,
          },
        },
      },
    });

    return Promise.all(
      children.map(async (child) => {
        const stats = await this.calculateCategoryStats(child.id);
        return {
          ...child,
          ...stats,
        };
      })
    );
  }

  async getRootCategories() {
    return this.findAll(1, 100, undefined, true, null, undefined);
  }

  async getCategoriesByLevel(level: number) {
    return this.findAll(1, 100, undefined, true, undefined, level);
  }

  // Category statistics
  private async calculateCategoryStats(categoryId: string) {
    const [
      totalDeals,
      activeDeals,
      totalMerchants,
      childCategoriesCount,
    ] = await Promise.all([
      this.prisma.deal.count({
        where: { categoryId },
      }),
      this.prisma.deal.count({
        where: {
          categoryId,
          status: 'ACTIVE',
        },
      }),
      this.prisma.deal.groupBy({
        by: ['merchantId'],
        where: { categoryId },
        _count: { merchantId: true },
      }).then(result => result.length),
      this.prisma.category.count({
        where: { parentId: categoryId },
      }),
    ]);

    return {
      totalDeals,
      activeDeals,
      totalMerchants,
      childCategoriesCount,
    };
  }

  private async generateCategoryPath(parentId: string | null, categoryName: string): Promise<string> {
    if (!parentId) {
      return categoryName.toLowerCase().replace(/\s+/g, '-');
    }

    const parent = await this.prisma.category.findUnique({
      where: { id: parentId },
      select: { path: true },
    });

    if (!parent) {
      return categoryName.toLowerCase().replace(/\s+/g, '-');
    }

    const parentPath = parent.path || '';
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    
    return parentPath ? `${parentPath}/${categorySlug}` : categorySlug;
  }

  private async getNextSortOrder(parentId: string | null): Promise<number> {
    const lastCategory = await this.prisma.category.findFirst({
      where: { parentId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    return (lastCategory?.sortOrder || 0) + 1;
  }

  private async isDescendant(categoryId: string, potentialParentId: string): Promise<boolean> {
    let currentId = potentialParentId;

    while (currentId) {
      if (currentId === categoryId) {
        return true;
      }

      const category = await this.prisma.category.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });

      if (!category) break;
      currentId = category.parentId || '';
    }

    return false;
  }

  // Search and filtering
  async searchCategories(query: string, filters: any = {}) {
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    };

    // Apply additional filters
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    if (filters.level !== undefined) {
      where.level = filters.level;
    }

    return this.prisma.category.findMany({
      where,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            deals: true,
            children: true,
          },
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
    });
  }

  // Category management
  async activate(id: string) {
    const category = await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    const category = await this.findOne(id);

    // Check if category has active deals
    const activeDeals = await this.prisma.deal.count({
      where: {
        categoryId: id,
        status: 'ACTIVE',
      },
    });

    if (activeDeals > 0) {
      throw new BadRequestException('Cannot deactivate category with active deals. Please deactivate deals first.');
    }

    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async reorderCategories(categoryOrders: { id: string; sortOrder: number }[]) {
    const updates = categoryOrders.map(({ id, sortOrder }) =>
      this.prisma.category.update({
        where: { id },
        data: { sortOrder },
      })
    );

    await Promise.all(updates);

    return { message: 'Categories reordered successfully' };
  }

  // Category analytics
  async getCategoryAnalytics() {
    const [
      totalCategories,
      activeCategories,
      rootCategories,
      categoriesWithDeals,
      topCategories,
      levelDistribution,
    ] = await Promise.all([
      this.prisma.category.count(),
      this.prisma.category.count({ where: { isActive: true } }),
      this.prisma.category.count({ where: { parentId: null } }),
      this.prisma.category.count({
        where: {
          deals: {
            some: {},
          },
        },
      }),
      this.prisma.category.findMany({
        include: {
          _count: {
            select: {
              deals: true,
            },
          },
        },
        orderBy: {
          deals: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.category.groupBy({
        by: ['level'],
        _count: {
          level: true,
        },
        orderBy: {
          level: 'asc',
        },
      }),
    ]);

    return {
      totalCategories,
      activeCategories,
      rootCategories,
      categoriesWithDeals,
      levelDistribution: levelDistribution.map(item => ({
        level: item.level,
        count: item._count.level,
      })),
      topCategories: topCategories.map(category => ({
        id: category.id,
        name: category.name,
        level: category.level,
        dealCount: category._count.deals,
      })),
    };
  }

  // Get all categories (for simple listing)
  async getAllCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [
        { name: 'asc' },
      ],
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            deals: true,
            children: true,
          },
        },
      },
    });
  }
}