import { useQuery } from '@tanstack/react-query';

import { Capability } from '@incidents/shared';
import type { AssigneeSuggestion } from '@incidents/shared';

import { useCapability } from '@/features/auth/hooks/use-auth';
import { getAssigneeSuggestion } from '@/features/incidents/api/incidents.api';
import { incidentsKeys } from '@/features/incidents/api/incidents.keys';

export function useAssigneeSuggestion(
  incidentId: string,
  isNeeded: boolean,
): AssigneeSuggestion | null {
  const canManageAssignments = useCapability(Capability.MANAGE_ASSIGNMENTS);
  const query = useQuery({
    queryKey: incidentsKeys.assigneeSuggestion(incidentId),
    queryFn: async () => getAssigneeSuggestion(incidentId),
    enabled: canManageAssignments && isNeeded,
  });

  return query.data?.suggestion ?? null;
}
