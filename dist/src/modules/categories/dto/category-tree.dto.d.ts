export declare class CategoryTreeNodeDto {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: string;
    level: number;
    path: string;
    isActive: boolean;
    sortOrder?: number;
    totalDeals: number;
    activeDeals: number;
    children: CategoryTreeNodeDto[];
}
