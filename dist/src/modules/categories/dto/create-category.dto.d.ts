export declare class CreateCategoryDto {
    name: string;
    description?: string;
    icon?: string;
    image?: string;
    color?: string;
    parentId?: string;
    level?: number;
    path?: string;
    sortOrder?: number;
    tags?: string[];
    metadata?: Record<string, any>;
    isActive?: boolean;
}
