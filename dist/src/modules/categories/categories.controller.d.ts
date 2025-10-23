import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { AuthUser } from '../auth/types';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, user: AuthUser): Promise<{
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
    findAll(page: number, limit: number, search?: string, isActive?: string, parentId?: string, level?: string): Promise<{
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
    getCategoryTree(): Promise<import("./dto/category-tree.dto").CategoryTreeNodeDto[]>;
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
    search(query: string, isActive?: string, parentId?: string, level?: string): Promise<({
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
    test(): Promise<{
        success: boolean;
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
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    getAnalytics(): Promise<{
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
    getChildCategories(id: string): Promise<{
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
    update(id: string, updateCategoryDto: UpdateCategoryDto, user: AuthUser): Promise<{
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
    remove(id: string, user: AuthUser): Promise<{
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
    activate(id: string, user: AuthUser): Promise<{
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
    deactivate(id: string, user: AuthUser): Promise<{
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
    }[], user: AuthUser): Promise<{
        message: string;
    }>;
}
