import { useQuery } from '@tanstack/react-query';

import type { PossibleDuplicatesResponse } from '@incidents/shared';

import { getPossibleDuplicates } from '@/features/incidents/api/incidents.api';
import { incidentsKeys } from '@/features/incidents/api/incidents.keys';

const DUPLICATES_STALE_TIME_MS = 30_000;

export function usePossibleDuplicates(
  category: string,
  location: string,
): PossibleDuplicatesResponse | null {
  const query = useQuery({
    queryKey: incidentsKeys.possibleDuplicates({ category, location }),
    queryFn: async () => getPossibleDuplicates({ category, location }),
    enabled: category.length > 0 && location.length > 0,
    staleTime: DUPLICATES_STALE_TIME_MS,
  });

  return query.data ?? null;
}
