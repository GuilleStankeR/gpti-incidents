import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import type { IncidentSummary } from '@incidents/shared';

import { IncidentStatusBadge } from '@/features/incidents/components/IncidentStatusBadge';
import { SlaIndicator } from '@/features/incidents/components/SlaIndicator';
import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { buildIncidentDetailPath } from '@/shared/routing/route-paths';
import { Icon } from '@/shared/ui/icons/Icon';

interface IncidentCardProps {
  readonly incident: IncidentSummary;
}

export function IncidentCard({ incident }: IncidentCardProps): ReactElement {
  return (
    <Link
      to={buildIncidentDetailPath(incident.id)}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs focus-visible:outline-2 focus-visible:outline-accent-ring active:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="font-mono text-sm font-semibold text-accent">{incident.folio}</span>
          <span className="truncate text-sm text-slate-500">{incident.category.name}</span>
        </div>
        <IncidentStatusBadge status={incident.status} />
      </div>
      <p className="line-clamp-2 text-sm text-slate-800">{incident.description}</p>
      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex min-w-0 flex-col gap-1 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <Icon name="mapPin" size="sm" />
            {incident.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="user" size="sm" />
            {incident.assignee?.name ?? incidentsCopy.values.unassigned}
          </span>
        </div>
        <SlaIndicator incident={incident} />
      </div>
    </Link>
  );
}
