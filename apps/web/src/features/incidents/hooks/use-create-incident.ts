import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IncidentDetail } from '@incidents/shared';

import { createIncident } from '@/features/incidents/api/incidents.api';
import type { NewIncidentInput } from '@/features/incidents/api/incidents.api';
import { incidentsKeys } from '@/features/incidents/api/incidents.keys';
import { buildIncidentDetailPath } from '@/shared/routing/route-paths';

export interface CreatedIncidentState {
  readonly createdFolio: string;
}

export function useCreateIncident(): UseMutationResult<IncidentDetail, Error, NewIncidentInput> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createIncident,
    onSuccess: async (incident) => {
      queryClient.setQueryData(incidentsKeys.detail(incident.id), incident);
      await queryClient.invalidateQueries({ queryKey: incidentsKeys.all, refetchType: 'none' });
      const state: CreatedIncidentState = { createdFolio: incident.folio };
      await navigate(buildIncidentDetailPath(incident.id), { state });
    },
  });
}
