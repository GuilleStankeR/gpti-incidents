import type { ReactElement } from 'react';

import type { ReportPrefill } from '@/features/incidents/hooks/use-report-prefill';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { InlineAlert } from '@/shared/ui/InlineAlert';

interface ReportPrefillNoticeProps {
  readonly prefill: ReportPrefill;
}

export function ReportPrefillNotice({ prefill }: ReportPrefillNoticeProps): ReactElement | null {
  const copy = reportIncidentCopy.prefill;

  if (prefill.status === 'location') {
    return <InlineAlert tone="info">{copy.fromQrCode(prefill.location)}</InlineAlert>;
  }

  if (prefill.status === 'otherCondominium') {
    return <InlineAlert tone="warning">{copy.otherCondominium}</InlineAlert>;
  }

  return null;
}
