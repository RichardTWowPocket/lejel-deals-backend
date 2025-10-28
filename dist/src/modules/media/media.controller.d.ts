import { MediaService } from './media.service';
import type { AuthUser } from '../auth/types';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    requestUploadUrl(filename: string, contentType: string, user: AuthUser): Promise<{
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
    uploadFile(file: any, user: AuthUser): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedBy: string | null;
    }>;
    getMedia(id: string): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedBy: string | null;
    }>;
    listMedia(page: number, limit: number, user: AuthUser): Promise<{
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
    deleteMedia(id: string, user: AuthUser): Promise<{
        message: string;
        id: string;
    }>;
}
