import {
  Controller,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';

const ALLOWED_FOLDERS = ['images', 'videos', 'audios'] as const;
type Folder = (typeof ALLOWED_FOLDERS)[number];

const MIME_MAP: Record<Folder, RegExp> = {
  images: /^image\//,
  videos: /^video\//,
  audios: /^audio\//,
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get(':folder/presign')
  async presign(
    @Param('folder') folder: string,
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
  ) {
    if (!ALLOWED_FOLDERS.includes(folder as Folder)) {
      throw new BadRequestException(
        `Folder must be one of: ${ALLOWED_FOLDERS.join(', ')}`,
      );
    }
    if (!filename || !contentType) {
      throw new BadRequestException('filename and contentType are required');
    }
    const typedFolder = folder as Folder;
    if (!MIME_MAP[typedFolder].test(contentType)) {
      throw new BadRequestException(
        `Invalid contentType for folder "${folder}"`,
      );
    }
    return this.uploadService.getPresignedUrl(
      typedFolder,
      filename,
      contentType,
    );
  }

  @Post(':folder')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
    }),
  )
  async upload(
    @Param('folder') folder: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!ALLOWED_FOLDERS.includes(folder as Folder)) {
      throw new BadRequestException(
        `Folder must be one of: ${ALLOWED_FOLDERS.join(', ')}`,
      );
    }

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const typedFolder = folder as Folder;
    if (!MIME_MAP[typedFolder].test(file.mimetype)) {
      throw new BadRequestException(`Invalid file type for folder "${folder}"`);
    }

    return this.uploadService.uploadFile(file, typedFolder);
  }
}
