import type {
  IncidentDetail,
  IncidentSummary,
  ListIncidentsQuery,
  PaginatedResponse,
  ReassignIncidentRequest,
  TransitionIncidentRequest,
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

export async function transitionIncident(
  incidentId: string,
  request: TransitionIncidentRequest,
): Promise<IncidentDetail> {
  return httpClient.post<IncidentDetail>(`${INCIDENTS_PATH}/${incidentId}/transitions`, request);
}

export async function reassignIncident(
  incidentId: string,
  request: ReassignIncidentRequest,
): Promise<IncidentDetail> {
  return httpClient.patch<IncidentDetail>(`${INCIDENTS_PATH}/${incidentId}/assignee`, request);
}

export async function attachEvidence(
  incidentId: string,
  photos: readonly File[],
): Promise<IncidentDetail> {
  const formData = new FormData();
  for (const photo of photos) {
    formData.append(PHOTOS_FIELD, photo);
  }
  return httpClient.postForm<IncidentDetail>(`${INCIDENTS_PATH}/${incidentId}/evidence`, formData);
}

export async function downloadCaseFile(incidentId: string): Promise<Blob> {
  return httpClient.getBlob(`${INCIDENTS_PATH}/${incidentId}/case-file.pdf`);
}

export async function getEvidenceFile(url: string): Promise<Blob> {
  return httpClient.getBlob(url);
}
