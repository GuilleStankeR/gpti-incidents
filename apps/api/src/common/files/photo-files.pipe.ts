import { basename } from 'node:path';

import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';
import { AppConfig } from '@/config/app-config';

import { isDecodableImage } from './image-decoding';
import { detectPhotoMimeType } from './photo-signature';
import { calculateSha256 } from './sha256';
import type { ValidatedPhoto } from './validated-photo';

type UploadedFile = Express.Multer.File;

@Injectable()
export class PhotoFilesPipe implements PipeTransform<
  UploadedFile[] | undefined,
  Promise<readonly ValidatedPhoto[]>
> {
  constructor(private readonly config: AppConfig) {}

  async transform(files: UploadedFile[] | undefined): Promise<readonly ValidatedPhoto[]> {
    const uploadedFiles = files ?? [];

    if (uploadedFiles.length > this.config.uploads.maxFilesPerUpload) {
      throw new DomainError(ErrorCode.INVALID_FILE);
    }

    return Promise.all(uploadedFiles.map(async (file) => this.validatePhoto(file)));
  }

  private async validatePhoto(file: UploadedFile): Promise<ValidatedPhoto> {
    const mimeType = detectPhotoMimeType(file.buffer);
    const isWithinSizeLimit = file.size <= this.config.uploads.maxFileSizeBytes;

    if (mimeType === null || !isWithinSizeLimit || !(await isDecodableImage(file.buffer))) {
      throw new DomainError(ErrorCode.INVALID_FILE);
    }

    return {
      originalName: basename(file.originalname),
      mimeType,
      sizeBytes: file.size,
      sha256: calculateSha256(file.buffer),
      content: file.buffer,
    };
  }
}
