import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import type { CatalogsResponse } from '@incidents/shared';

import { getCatalogs } from '@/features/incidents/api/catalogs.api';
import { catalogsKeys } from '@/features/incidents/api/incidents.keys';

export function useCatalogs(): UseQueryResult<CatalogsResponse> {
  return useQuery({ queryKey: catalogsKeys.all, queryFn: getCatalogs, staleTime: Infinity });
}
