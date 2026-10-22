import type {
  IncidentDetail,
  IncidentSummary,
  ListIncidentsQuery,
  PaginatedResponse,
} from '@incidents/shared';

import type { Coordinates } from '@/features/incidents/incident.types';
import { httpClient } from '@/shared/api/http-client';

const INCIDENTS_PATH = '/incidents';
const PHOTOS_FIELD = 'photos';

export interface NewIncidentInput {
  readonly categoryCode: string;
  readonly description: string;
  readonly location: string;
  readonly occurredAt: string;
  readonly coordinates: Coordinates | null;
  readonly photos: readonly File[];
}

function buildIncidentFormData(input: NewIncidentInput): FormData {
  const formData = new FormData();
  formData.set('categoryCode', input.categoryCode);
  formData.set('description', input.description);
  formData.set('location', input.location);
  formData.set('occurredAt', input.occurredAt);

  if (input.coordinates !== null) {
    formData.set('latitude', String(input.coordinates.latitude));
    formData.set('longitude', String(input.coordinates.longitude));
  }

  for (const photo of input.photos) {
    formData.append(PHOTOS_FIELD, photo);
  }

  return formData;
}

export async function listIncidents(
  query: ListIncidentsQuery,
): Promise<PaginatedResponse<IncidentSummary>> {
  return httpClient.get<PaginatedResponse<IncidentSummary>>(INCIDENTS_PATH, { ...query });
}

export async function getIncident(incidentId: string): Promise<IncidentDetail> {
  return httpClient.get<IncidentDetail>(`${INCIDENTS_PATH}/${incidentId}`);
}

export async function createIncident(input: NewIncidentInput): Promise<IncidentDetail> {
  return httpClient.postForm<IncidentDetail>(INCIDENTS_PATH, buildIncidentFormData(input));
}
