import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import type { IncidentDetail } from '@incidents/shared';

import { getIncident } from '@/features/incidents/api/incidents.api';
import { incidentsKeys } from '@/features/incidents/api/incidents.keys';

export function useIncident(incidentId: string): UseQueryResult<IncidentDetail> {
  return useQuery({
    queryKey: incidentsKeys.detail(incidentId),
    queryFn: async () => getIncident(incidentId),
  });
}
