"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
const path = __importStar(require("path"));
let MediaService = class MediaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateUploadUrl(filename, contentType, uploadedBy) {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
        ];
        if (!allowedMimeTypes.includes(contentType)) {
            throw new common_1.BadRequestException(`File type ${contentType} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
        }
        const ext = path.extname(filename).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
        if (!allowedExtensions.includes(ext)) {
            throw new common_1.BadRequestException(`File extension ${ext} is not allowed`);
        }
        const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        const uploadPath = `/uploads/${uniqueFilename}`;
        return {
            uploadUrl: `/api/media/upload/direct`,
            filename: uniqueFilename,
            uploadPath,
            contentType,
            expiresIn: 3600,
            maxFileSize: 5242880,
            metadata: {
                originalFilename: filename,
                storedFilename: uniqueFilename,
                contentType,
                uploadedBy,
            },
        };
    }
    async saveMedia(filename, originalName, mimeType, size, url, uploadedBy) {
        const media = await this.prisma.media.create({
            data: {
                filename,
                originalName,
                mimeType,
                size,
                url,
                uploadedBy: uploadedBy || null,
            },
        });
        return media;
    }
    async getMediaById(id) {
        const media = await this.prisma.media.findUnique({
            where: { id },
        });
        if (!media) {
            throw new common_1.NotFoundException(`Media with ID ${id} not found`);
        }
        return media;
    }
    async listMedia(page = 1, limit = 20, uploadedBy) {
        const skip = (page - 1) * limit;
        const where = {};
        if (uploadedBy) {
            where.uploadedBy = uploadedBy;
        }
        const [media, total] = await Promise.all([
            this.prisma.media.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.media.count({ where }),
        ]);
        return {
            data: media,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async deleteMedia(id) {
        const media = await this.getMediaById(id);
        await this.prisma.media.delete({
            where: { id },
        });
        return {
            message: 'Media deleted successfully',
            id: media.id,
        };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map