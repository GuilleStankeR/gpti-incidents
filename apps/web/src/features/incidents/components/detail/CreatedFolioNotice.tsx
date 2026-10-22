import type { ReactElement } from 'react';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { InlineAlert } from '@/shared/ui/InlineAlert';

interface CreatedFolioNoticeProps {
  readonly folio: string;
}

export function CreatedFolioNotice({ folio }: CreatedFolioNoticeProps): ReactElement {
  return (
    <InlineAlert tone="success" title={incidentDetailCopy.createdNotice.title(folio)}>
      {incidentDetailCopy.createdNotice.description}
    </InlineAlert>
  );
}
