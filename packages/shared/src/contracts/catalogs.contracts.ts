import type { PhotoMimeType } from '../limits.js';

export interface CategorySummary {
  readonly code: string;
  readonly name: string;
}

export interface CatalogCategory extends CategorySummary {
  readonly slaHours: number;
}

export interface UploadLimits {
  readonly maxFiles: number;
  readonly maxFileSizeBytes: number;
  readonly acceptedMimeTypes: readonly PhotoMimeType[];
}

export interface CatalogsResponse {
  readonly categories: readonly CatalogCategory[];
  readonly locations: readonly string[];
  readonly uploadLimits: UploadLimits;
}
