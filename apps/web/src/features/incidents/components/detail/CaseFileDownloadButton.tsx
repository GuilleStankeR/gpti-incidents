import type { ReactElement } from 'react';

import type { IncidentDetail } from '@incidents/shared';

import { useCaseFileDownload } from '@/features/incidents/hooks/use-case-file-download';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';
import { InlineAlert } from '@/shared/ui/InlineAlert';

interface CaseFileDownloadButtonProps {
  readonly incident: IncidentDetail;
}

export function CaseFileDownloadButton({ incident }: CaseFileDownloadButtonProps): ReactElement {
  const download = useCaseFileDownload(incident);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        isFullWidth
        isLoading={download.isPending}
        onClick={() => {
          download.mutate();
        }}
      >
        <Icon name="download" size="sm" />
        {incidentDetailCopy.actions.downloadCaseFile}
      </Button>
      {download.isError ? (
        <InlineAlert tone="error">{incidentDetailCopy.actions.downloadError}</InlineAlert>
      ) : null}
    </div>
  );
}
