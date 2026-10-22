import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import { DEFAULT_PAGE_SIZE } from '@incidents/shared';
import type { IncidentSummary, PaginatedResponse } from '@incidents/shared';

import { listIncidents } from '@/features/incidents/api/incidents.api';
import { incidentsKeys } from '@/features/incidents/api/incidents.keys';

import type { IncidentFilters } from './incident-filters-params';

export function useIncidents(
  filters: IncidentFilters,
): UseQueryResult<PaginatedResponse<IncidentSummary>> {
  const query = { ...filters, pageSize: DEFAULT_PAGE_SIZE };

  return useQuery({
    queryKey: incidentsKeys.list(query),
    queryFn: async () => listIncidents(query),
    placeholderData: keepPreviousData,
  });
}
