import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import { Capability } from '@incidents/shared';
import type { UserWithRole } from '@incidents/shared';

import { useCapability } from '@/features/auth/hooks/use-auth';
import { assignableUsersKeys } from '@/features/incidents/api/incidents.keys';
import { getAssignableUsers } from '@/features/incidents/api/users.api';

export function useAssignableUsers(): UseQueryResult<UserWithRole[]> {
  const canManageAssignments = useCapability(Capability.MANAGE_ASSIGNMENTS);

  return useQuery({
    queryKey: assignableUsersKeys.all,
    queryFn: getAssignableUsers,
    enabled: canManageAssignments,
    staleTime: Infinity,
  });
}
