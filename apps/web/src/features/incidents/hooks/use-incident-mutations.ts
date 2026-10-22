import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryClient, UseMutationResult } from '@tanstack/react-query';

import type {
  IncidentDetail,
  ReassignIncidentRequest,
  TransitionIncidentRequest,
} from '@incidents/shared';

import {
  attachEvidence,
  reassignIncident,
  transitionIncident,
} from '@/features/incidents/api/incidents.api';
import { incidentsKeys } from '@/features/incidents/api/incidents.keys';

async function storeUpdatedIncident(
  queryClient: QueryClient,
  incident: IncidentDetail,
): Promise<void> {
  queryClient.setQueryData(incidentsKeys.detail(incident.id), incident);
  await queryClient.invalidateQueries({ queryKey: incidentsKeys.lists() });
}

export function useTransitionIncident(
  incidentId: string,
): UseMutationResult<IncidentDetail, Error, TransitionIncidentRequest> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request) => transitionIncident(incidentId, request),
    onSuccess: async (incident) => storeUpdatedIncident(queryClient, incident),
  });
}

export function useReassignIncident(
  incidentId: string,
): UseMutationResult<IncidentDetail, Error, ReassignIncidentRequest> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request) => reassignIncident(incidentId, request),
    onSuccess: async (incident) => storeUpdatedIncident(queryClient, incident),
  });
}

export function useAttachEvidence(
  incidentId: string,
): UseMutationResult<IncidentDetail, Error, readonly File[]> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photos) => attachEvidence(incidentId, photos),
    onSuccess: async (incident) => storeUpdatedIncident(queryClient, incident),
  });
}
