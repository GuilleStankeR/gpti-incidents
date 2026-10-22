import type { ReactElement } from 'react';

import type { IncidentDetail } from '@incidents/shared';

import { IncidentStatusBadge } from '@/features/incidents/components/IncidentStatusBadge';
import { SlaIndicator } from '@/features/incidents/components/SlaIndicator';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { formatDateTime } from '@/shared/lib/format';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { Icon } from '@/shared/ui/icons/Icon';

interface IncidentDetailHeaderProps {
  readonly incident: IncidentDetail;
}

export function IncidentDetailHeader({ incident }: IncidentDetailHeaderProps): ReactElement {
  return (
    <header className="flex flex-col gap-4">
      <div>
        <ButtonLink to={ROUTE_PATHS.incidents} variant="ghost">
          <Icon name="arrowLeft" size="sm" />
          {incidentDetailCopy.back}
        </ButtonLink>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {incident.folio}
            </h1>
            <IncidentStatusBadge status={incident.status} />
          </div>
          <p className="text-sm text-slate-500">
            {incidentDetailCopy.header.reportedBy(
              incident.reporter.name,
              formatDateTime(incident.reportedAt),
            )}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xs">
          <SlaIndicator incident={incident} />
        </div>
      </div>
    </header>
  );
}
