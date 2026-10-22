import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import { getEvidenceFile } from '@/features/incidents/api/incidents.api';
import { evidenceKeys } from '@/features/incidents/api/incidents.keys';
import { readBlobAsDataUrl } from '@/shared/lib/blob';

export function useEvidenceImage(url: string): UseQueryResult<string> {
  return useQuery({
    queryKey: evidenceKeys.image(url),
    queryFn: async () => readBlobAsDataUrl(await getEvidenceFile(url)),
    staleTime: Infinity,
  });
}
