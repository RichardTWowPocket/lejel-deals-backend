import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTreeNodeDto } from './dto/category-tree.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        children: {
            totalDeals: number;
            activeDeals: number;
            totalMerchants: number;
            childCategoriesCount: number;
            parent: {
                id: string;
                name: string;
            } | null;
            _count: {
                children: number;
                deals: number;
            };
            id: string;
            name: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            image: string | null;
            parentId: string | null;
            level: number;
            path: string | null;
            sortOrder: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalDeals: number;
        activeDeals: number;
        totalMerchants: number;
        childCategoriesCount: number;
        parent: {
            id: string;
            name: string;
        } | null;
        _count: {
            children: number;
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, search?: string, isActive?: boolean, parentId?: string | null, level?: number): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            image: string | null;
            parentId: string | null;
            level: number;
            path: string | null;
            sortOrder: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        children: {
            totalDeals: number;
            activeDeals: number;
            totalMerchants: number;
            childCategoriesCount: number;
            parent: {
                id: string;
                name: string;
            } | null;
            _count: {
                children: number;
                deals: number;
            };
            id: string;
            name: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            image: string | null;
            parentId: string | null;
            level: number;
            path: string | null;
            sortOrder: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalDeals: number;
        activeDeals: number;
        totalMerchants: number;
        childCategoriesCount: number;
        parent: {
            id: string;
            name: string;
        } | null;
        _count: {
            children: number;
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByName(name: string): Promise<{
        children: {
            totalDeals: number;
            activeDeals: number;
            totalMerchants: number;
            childCategoriesCount: number;
            parent: {
                id: string;
                name: string;
            } | null;
            _count: {
                children: number;
                deals: number;
            };
            id: string;
            name: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            image: string | null;
            parentId: string | null;
            level: number;
            path: string | null;
            sortOrder: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalDeals: number;
        activeDeals: number;
        totalMerchants: number;
        childCategoriesCount: number;
        parent: {
            id: string;
            name: string;
        } | null;
        _count: {
            children: number;
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        children: {
            totalDeals: number;
            activeDeals: number;
            totalMerchants: number;
            childCategoriesCount: number;
            parent: {
                id: string;
                name: string;
            } | null;
            _count: {
                children: number;
                deals: number;
            };
            id: string;
            name: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            image: string | null;
            parentId: string | null;
            level: number;
            path: string | null;
            sortOrder: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalDeals: number;
        activeDeals: number;
        totalMerchants: number;
        childCategoriesCount: number;
        parent: {
            id: string;
            name: string;
        } | null;
        _count: {
            children: number;
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCategoryTree(): Promise<CategoryTreeNodeDto[]>;
    private buildCategoryTreeNode;
    getChildCategories(parentId: string): Promise<{
        totalDeals: number;
        activeDeals: number;
        totalMerchants: number;
        childCategoriesCount: number;
        parent: {
            id: string;
            name: string;
        } | null;
        _count: {
            children: number;
            deals: number;
        };
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getRootCategories(): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            image: string | null;
            parentId: string | null;
            level: number;
            path: string | null;
            sortOrder: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCategoriesByLevel(level: number): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            image: string | null;
            parentId: string | null;
            level: number;
            path: string | null;
            sortOrder: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    private calculateCategoryStats;
    private generateCategoryPath;
    private getNextSortOrder;
    private isDescendant;
    searchCategories(query: string, filters?: any): Promise<({
        parent: {
            id: string;
            name: string;
        } | null;
        _count: {
            children: number;
            deals: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    activate(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reorderCategories(categoryOrders: {
        id: string;
        sortOrder: number;
    }[]): Promise<{
        message: string;
    }>;
    getCategoryAnalytics(): Promise<{
        totalCategories: number;
        activeCategories: number;
        rootCategories: number;
        categoriesWithDeals: number;
        levelDistribution: {
            level: number;
            count: number;
        }[];
        topCategories: {
            id: string;
            name: string;
            level: number;
            dealCount: number;
        }[];
    }>;
    getAllCategories(): Promise<({
        parent: {
            id: string;
            name: string;
        } | null;
        _count: {
            children: number;
            deals: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        image: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        sortOrder: number;
        tags: string[];
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
