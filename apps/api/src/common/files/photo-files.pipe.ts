import { basename } from 'node:path';

import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';

import { ErrorCode } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';
import { AppConfig } from '@/config/app-config';

import { detectPhotoMimeType } from './photo-signature';
import { calculateSha256 } from './sha256';
import type { ValidatedPhoto } from './validated-photo';

type UploadedFile = Express.Multer.File;

@Injectable()
export class PhotoFilesPipe implements PipeTransform<
  UploadedFile[] | undefined,
  readonly ValidatedPhoto[]
> {
  constructor(private readonly config: AppConfig) {}

  transform(files: UploadedFile[] | undefined): readonly ValidatedPhoto[] {
    const uploadedFiles = files ?? [];

    if (uploadedFiles.length > this.config.uploads.maxFilesPerUpload) {
      throw new DomainError(ErrorCode.INVALID_FILE);
    }

    return uploadedFiles.map((file) => this.validatePhoto(file));
  }

  private validatePhoto(file: UploadedFile): ValidatedPhoto {
    const mimeType = detectPhotoMimeType(file.buffer);

    if (mimeType === null || file.size > this.config.uploads.maxFileSizeBytes) {
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
