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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { name: createCategoryDto.name },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        let parentCategory = null;
        if (createCategoryDto.parentId) {
            parentCategory = await this.prisma.category.findUnique({
                where: { id: createCategoryDto.parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Parent category not found');
            }
            if (!parentCategory.isActive) {
                throw new common_1.BadRequestException('Cannot create subcategory under inactive parent category');
            }
        }
        const level = parentCategory ? parentCategory.level + 1 : 0;
        const path = await this.generateCategoryPath(createCategoryDto.parentId || null, createCategoryDto.name);
        const nextSortOrder = await this.getNextSortOrder(createCategoryDto.parentId || null);
        const { tags, metadata, ...categoryData } = createCategoryDto;
        const category = await this.prisma.category.create({
            data: {
                ...categoryData,
                level,
                path,
                sortOrder: createCategoryDto.sortOrder ?? nextSortOrder,
                tags: tags || [],
                metadata: metadata,
            },
        });
        return this.findOne(category.id);
    }
    async findAll(page = 1, limit = 10, search, isActive, parentId, level) {
        const skip = (page - 1) * limit;
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Category not found');
        }
        const stats = await this.calculateCategoryStats(category.id);
        const children = await this.getChildCategories(category.id);
        return {
            ...category,
            ...stats,
            children,
        };
    }
    async findByName(name) {
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
            throw new common_1.NotFoundException('Category not found');
        }
        return this.findOne(category.id);
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existingCategory = await this.prisma.category.findUnique({
                where: { name: updateCategoryDto.name },
            });
            if (existingCategory) {
                throw new common_1.ConflictException('Category name is already taken');
            }
        }
        if (updateCategoryDto.parentId !== undefined && updateCategoryDto.parentId !== category.parentId) {
            if (updateCategoryDto.parentId) {
                const parentCategory = await this.prisma.category.findUnique({
                    where: { id: updateCategoryDto.parentId },
                });
                if (!parentCategory) {
                    throw new common_1.NotFoundException('Parent category not found');
                }
                if (!parentCategory.isActive) {
                    throw new common_1.BadRequestException('Cannot set inactive category as parent');
                }
                if (updateCategoryDto.parentId === id) {
                    throw new common_1.BadRequestException('Category cannot be its own parent');
                }
                const isDescendant = await this.isDescendant(id, updateCategoryDto.parentId);
                if (isDescendant) {
                    throw new common_1.BadRequestException('Cannot set descendant category as parent');
                }
            }
        }
        const { tags, metadata, ...categoryData } = updateCategoryDto;
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
                tags: tags,
                metadata: metadata,
            },
        });
        return this.findOne(updatedCategory.id);
    }
    async remove(id) {
        const category = await this.findOne(id);
        const childCategories = await this.prisma.category.count({
            where: { parentId: id },
        });
        if (childCategories > 0) {
            throw new common_1.BadRequestException('Cannot delete category with child categories. Please delete or move child categories first.');
        }
        const activeDeals = await this.prisma.deal.count({
            where: {
                categoryId: id,
                status: 'ACTIVE',
            },
        });
        if (activeDeals > 0) {
            throw new common_1.BadRequestException('Cannot delete category with active deals. Please deactivate or move deals first.');
        }
        return this.prisma.category.delete({
            where: { id },
        });
    }
    async getCategoryTree() {
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
        const tree = await Promise.all(rootCategories.map(category => this.buildCategoryTreeNode(category.id)));
        return tree;
    }
    async buildCategoryTreeNode(categoryId, level = 0) {
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
            throw new common_1.NotFoundException('Category not found');
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
        const childNodes = await Promise.all(children.map(child => this.buildCategoryTreeNode(child.id, level + 1)));
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
    async getChildCategories(parentId) {
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
        return Promise.all(children.map(async (child) => {
            const stats = await this.calculateCategoryStats(child.id);
            return {
                ...child,
                ...stats,
            };
        }));
    }
    async getRootCategories() {
        return this.findAll(1, 100, undefined, true, null, undefined);
    }
    async getCategoriesByLevel(level) {
        return this.findAll(1, 100, undefined, true, undefined, level);
    }
    async calculateCategoryStats(categoryId) {
        const [totalDeals, activeDeals, totalMerchants, childCategoriesCount,] = await Promise.all([
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
    async generateCategoryPath(parentId, categoryName) {
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
    async getNextSortOrder(parentId) {
        const lastCategory = await this.prisma.category.findFirst({
            where: { parentId },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        return (lastCategory?.sortOrder || 0) + 1;
    }
    async isDescendant(categoryId, potentialParentId) {
        let currentId = potentialParentId;
        while (currentId) {
            if (currentId === categoryId) {
                return true;
            }
            const category = await this.prisma.category.findUnique({
                where: { id: currentId },
                select: { parentId: true },
            });
            if (!category)
                break;
            currentId = category.parentId || '';
        }
        return false;
    }
    async searchCategories(query, filters = {}) {
        const where = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { tags: { has: query } },
            ],
        };
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
    async activate(id) {
        const category = await this.findOne(id);
        return this.prisma.category.update({
            where: { id },
            data: { isActive: true },
        });
    }
    async deactivate(id) {
        const category = await this.findOne(id);
        const activeDeals = await this.prisma.deal.count({
            where: {
                categoryId: id,
                status: 'ACTIVE',
            },
        });
        if (activeDeals > 0) {
            throw new common_1.BadRequestException('Cannot deactivate category with active deals. Please deactivate deals first.');
        }
        return this.prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async reorderCategories(categoryOrders) {
        const updates = categoryOrders.map(({ id, sortOrder }) => this.prisma.category.update({
            where: { id },
            data: { sortOrder },
        }));
        await Promise.all(updates);
        return { message: 'Categories reordered successfully' };
    }
    async getCategoryAnalytics() {
        const [totalCategories, activeCategories, rootCategories, categoriesWithDeals, topCategories, levelDistribution,] = await Promise.all([
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
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map