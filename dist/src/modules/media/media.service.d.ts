import { PrismaService } from '../../prisma/prisma.service';
export declare class MediaService {
    private prisma;
    constructor(prisma: PrismaService);
    generateUploadUrl(filename: string, contentType: string, uploadedBy?: string): Promise<{
        uploadUrl: string;
        filename: string;
        uploadPath: string;
        contentType: string;
        expiresIn: number;
        maxFileSize: number;
        metadata: {
            originalFilename: string;
            storedFilename: string;
            contentType: string;
            uploadedBy: string | undefined;
        };
    }>;
    saveMedia(filename: string, originalName: string, mimeType: string, size: number, url: string, uploadedBy?: string): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedBy: string | null;
    }>;
    getMediaById(id: string): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedBy: string | null;
    }>;
    listMedia(page?: number, limit?: number, uploadedBy?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            url: string;
            uploadedBy: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    deleteMedia(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
