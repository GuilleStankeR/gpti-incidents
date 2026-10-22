import { Injectable } from '@nestjs/common';
import type { Category } from '@prisma/client';

import { ACCEPTED_PHOTO_MIME_TYPES } from '@incidents/shared';
import type { UploadLimits } from '@incidents/shared';

import { AppConfig } from '@/config/app-config';

import { CategoriesRepository } from './categories.repository';
import { LOCATIONS } from './locations.catalog';

export interface Catalogs {
  readonly categories: readonly Category[];
  readonly locations: readonly string[];
  readonly uploadLimits: UploadLimits;
}

@Injectable()
export class CatalogsService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly config: AppConfig,
  ) {}

  async getCatalogs(): Promise<Catalogs> {
    return {
      categories: await this.categoriesRepository.findAll(),
      locations: LOCATIONS,
      uploadLimits: {
        maxFiles: this.config.uploads.maxFilesPerUpload,
        maxFileSizeBytes: this.config.uploads.maxFileSizeBytes,
        acceptedMimeTypes: ACCEPTED_PHOTO_MIME_TYPES,
      },
    };
  }
}
