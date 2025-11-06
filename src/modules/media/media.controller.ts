import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import type { AuthUser } from '../auth/types';
import { UserRole } from '@prisma/client';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Generate upload URL for media file
   */
  @Roles(UserRole.MERCHANT, UserRole.SUPER_ADMIN)
  @Post('upload/request')
  @ApiOperation({ summary: 'Request upload URL for media file' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns upload URL and metadata' })
  @ApiResponse({ status: 400, description: 'Invalid file type or extension' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async requestUploadUrl(
    @Body('filename') filename: string,
    @Body('contentType') contentType: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mediaService.generateUploadUrl(filename, contentType, user.id);
  }

  /**
   * Direct upload endpoint (for small files)
   */
  @Roles(UserRole.MERCHANT, UserRole.SUPER_ADMIN)
  @Post('upload/direct')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload media file directly' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Media uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or missing data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadFile(@UploadedFile() file: any, @CurrentUser() user: AuthUser) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Generate filename and URL
    const url = `/uploads/${file.filename}`;

    const media = await this.mediaService.saveMedia(
      file.filename,
      file.originalname,
      file.mimetype,
      file.size,
      url,
      user.id,
    );

    return media;
  }

  /**
   * Get media by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Returns media information' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  async getMedia(@Param('id') id: string) {
    return this.mediaService.getMediaById(id);
  }

  /**
   * List media with pagination
   */
  @Roles(UserRole.MERCHANT, UserRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'List media with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns paginated media list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listMedia(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mediaService.listMedia(page, limit, user.id);
  }

  /**
   * Delete media
   */
  @Roles(UserRole.MERCHANT, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Media deleted successfully' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteMedia(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.mediaService.deleteMedia(id);
  }
}
