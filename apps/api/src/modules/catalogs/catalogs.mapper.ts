import type { Category } from '@prisma/client';

import type { CatalogCategory, CatalogsResponse } from '@incidents/shared';

import type { Catalogs } from './catalogs.service';

export function toCatalogCategory(category: Category): CatalogCategory {
  return { code: category.code, name: category.name, slaHours: category.slaHours };
}

export function toCatalogsResponse(catalogs: Catalogs): CatalogsResponse {
  return {
    categories: catalogs.categories.map(toCatalogCategory),
    locations: catalogs.locations,
    uploadLimits: catalogs.uploadLimits,
  };
}
