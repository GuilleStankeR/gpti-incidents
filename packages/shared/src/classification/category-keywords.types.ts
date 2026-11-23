import type { CategoryCode } from '../category-code.js';

export type ClassifiableCategoryCode = Exclude<CategoryCode, 'OTHER'>;

export interface CategoryKeywords {
  readonly strong: readonly string[];
  readonly moderate: readonly string[];
}

export interface LocationHint {
  readonly categoryCode: ClassifiableCategoryCode;
  readonly weight: number;
}
