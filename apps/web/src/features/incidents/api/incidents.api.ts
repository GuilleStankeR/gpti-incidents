import type {
  IncidentDetail,
  IncidentSummary,
  ListIncidentsQuery,
  PaginatedResponse,
} from '@incidents/shared';

import { httpClient } from '@/shared/api/http-client';

const INCIDENTS_PATH = '/incidents';

export async function listIncidents(
  query: ListIncidentsQuery,
): Promise<PaginatedResponse<IncidentSummary>> {
  return httpClient.get<PaginatedResponse<IncidentSummary>>(INCIDENTS_PATH, { ...query });
}

export async function getIncident(incidentId: string): Promise<IncidentDetail> {
  return httpClient.get<IncidentDetail>(`${INCIDENTS_PATH}/${incidentId}`);
}
