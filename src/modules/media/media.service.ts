import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a presigned upload URL for media
   * In production, this would integrate with S3 or Cloudinary
   */
  async generateUploadUrl(filename: string, contentType: string, uploadedBy?: string) {
    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!allowedMimeTypes.includes(contentType)) {
      throw new BadRequestException(`File type ${contentType} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }

    // Validate file extension
    const ext = path.extname(filename).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(`File extension ${ext} is not allowed`);
    }

    // Generate unique filename
    const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
    const uploadPath = `/uploads/${uniqueFilename}`;

    // In production, generate a presigned URL here
    // For now, return a mock URL structure
    return {
      uploadUrl: `/api/media/upload/direct`, // Endpoint to receive file
      filename: uniqueFilename,
      uploadPath,
      contentType,
      expiresIn: 3600, // URL expires in 1 hour
      maxFileSize: 5242880, // 5MB in bytes
      metadata: {
        originalFilename: filename,
        storedFilename: uniqueFilename,
        contentType,
        uploadedBy,
      },
    };
  }

  /**
   * Save media record after upload
   */
  async saveMedia(
    filename: string,
    originalName: string,
    mimeType: string,
    size: number,
    url: string,
    uploadedBy?: string,
  ) {
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

  /**
   * Get media by ID
   */
  async getMediaById(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  /**
   * List media with pagination
   */
  async listMedia(page: number = 1, limit: number = 20, uploadedBy?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

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

  /**
   * Delete media
   */
  async deleteMedia(id: string) {
    const media = await this.getMediaById(id);

    await this.prisma.media.delete({
      where: { id },
    });

    return {
      message: 'Media deleted successfully',
      id: media.id,
    };
  }
}


