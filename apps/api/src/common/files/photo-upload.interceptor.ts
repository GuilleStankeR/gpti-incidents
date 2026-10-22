import { HttpException, Injectable } from '@nestjs/common';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Observable } from 'rxjs';

import { ErrorCode } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';
import { AppConfig } from '@/config/app-config';

export const PHOTOS_FIELD_NAME = 'photos';
const MULTIPART_FILENAME_CHARSET = 'utf8';

@Injectable()
export class PhotoUploadInterceptor implements NestInterceptor {
  private readonly filesInterceptor: NestInterceptor;

  constructor(config: AppConfig) {
    const { maxFilesPerUpload, maxFileSizeBytes } = config.uploads;
    const MultipartFilesInterceptor = FilesInterceptor(PHOTOS_FIELD_NAME, maxFilesPerUpload, {
      limits: { files: maxFilesPerUpload, fileSize: maxFileSizeBytes },
      defParamCharset: MULTIPART_FILENAME_CHARSET,
    });
    this.filesInterceptor = new MultipartFilesInterceptor();
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    try {
      return await this.filesInterceptor.intercept(context, next);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new DomainError(ErrorCode.INVALID_FILE);
      }

      throw error;
    }
  }
}
