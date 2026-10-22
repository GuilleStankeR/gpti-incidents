import type { CatalogsResponse } from '@incidents/shared';

import { httpClient } from '@/shared/api/http-client';

export async function getCatalogs(): Promise<CatalogsResponse> {
  return httpClient.get<CatalogsResponse>('/catalogs');
}
