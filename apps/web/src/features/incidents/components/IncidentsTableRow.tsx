import type { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { IncidentSummary } from '@incidents/shared';

import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { buildIncidentDetailPath } from '@/shared/routing/route-paths';

import { IncidentStatusBadge } from './IncidentStatusBadge';
import { SlaIndicator } from './SlaIndicator';

interface IncidentsTableRowProps {
  readonly incident: IncidentSummary;
}

export function IncidentsTableRow({ incident }: IncidentsTableRowProps): ReactElement {
  const navigate = useNavigate();
  const detailPath = buildIncidentDetailPath(incident.id);

  return (
    <tr
      className="cursor-pointer align-top hover:bg-slate-50"
      onClick={() => {
        void navigate(detailPath);
      }}
    >
      <td className="px-4 py-3 whitespace-nowrap">
        <Link
          to={detailPath}
          className="font-mono text-sm font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent-ring"
        >
          {incident.folio}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">{incident.category.name}</td>
      <td className="max-w-xs px-4 py-3">
        <p className="line-clamp-2 text-sm text-slate-700">{incident.description}</p>
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-700">{incident.location}</td>
      <td className="px-4 py-3">
        <IncidentStatusBadge status={incident.status} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">
        {incident.assignee?.name ?? (
          <span className="text-slate-400">{incidentsCopy.values.unassigned}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <SlaIndicator incident={incident} />
      </td>
    </tr>
  );
}
