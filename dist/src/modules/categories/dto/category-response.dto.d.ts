export declare class CategoryHierarchyResponseDto {
    parentId?: string;
    level: number;
    path: string;
    parentName?: string;
}
export declare class CategoryResponseDto {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    image?: string;
    color?: string;
    parentId?: string;
    level: number;
    path?: string;
    sortOrder?: number;
    tags: string[];
    metadata?: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    hierarchy?: CategoryHierarchyResponseDto;
    totalDeals?: number;
    activeDeals?: number;
    totalMerchants?: number;
    childCategoriesCount?: number;
    children?: CategoryResponseDto[];
}
