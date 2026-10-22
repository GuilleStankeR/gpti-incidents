import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import type { IncidentDetail } from '@incidents/shared';

import { downloadCaseFile } from '@/features/incidents/api/incidents.api';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { saveBlob } from '@/shared/lib/blob';

export function useCaseFileDownload(
  incident: Pick<IncidentDetail, 'id' | 'folio'>,
): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const pdf = await downloadCaseFile(incident.id);
      saveBlob(pdf, incidentDetailCopy.caseFileName(incident.folio));
    },
  });
}
