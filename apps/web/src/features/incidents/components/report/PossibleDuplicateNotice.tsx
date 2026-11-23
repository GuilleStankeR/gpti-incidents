import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { DUPLICATE_WINDOW_HOURS } from '@incidents/shared';
import type { PossibleDuplicatesResponse } from '@incidents/shared';

import { IncidentStatusBadge } from '@/features/incidents/components/IncidentStatusBadge';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { formatDateTime } from '@/shared/lib/format';
import { buildIncidentDetailPath } from '@/shared/routing/route-paths';
import { InlineAlert } from '@/shared/ui/InlineAlert';

interface PossibleDuplicateNoticeProps {
  readonly result: PossibleDuplicatesResponse | null;
}

export function PossibleDuplicateNotice({
  result,
}: PossibleDuplicateNoticeProps): ReactElement | null {
  const copy = reportIncidentCopy.duplicates;

  if (result === null || (result.duplicates.length === 0 && result.hiddenCount === 0)) {
    return null;
  }

  const hasVisibleDuplicates = result.duplicates.length > 0;

  return (
    <InlineAlert tone="warning" title={copy.title}>
      <div className="flex flex-col gap-2">
        {hasVisibleDuplicates ? <p>{copy.visibleIntro(DUPLICATE_WINDOW_HOURS)}</p> : null}
        {hasVisibleDuplicates ? (
          <ul className="flex flex-col gap-1">
            {result.duplicates.map((duplicate) => (
              <li key={duplicate.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono font-semibold">{duplicate.folio}</span>
                <IncidentStatusBadge status={duplicate.status} />
                <span>{copy.reportedAt(formatDateTime(duplicate.reportedAt))}</span>
                <Link
                  to={buildIncidentDetailPath(duplicate.id)}
                  target="_blank"
                  aria-label={copy.openInNewTab(duplicate.folio)}
                  className="inline-flex min-h-11 items-center font-medium underline underline-offset-2"
                >
                  {copy.open}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {result.hiddenCount > 0 ? (
          <p>{copy.hidden(result.hiddenCount, DUPLICATE_WINDOW_HOURS)}</p>
        ) : null}
        {hasVisibleDuplicates ? <p>{copy.addPhotosHint}</p> : null}
        <p>{copy.canContinue}</p>
      </div>
    </InlineAlert>
  );
}
