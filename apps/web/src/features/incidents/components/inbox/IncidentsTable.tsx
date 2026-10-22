import type { ReactElement } from 'react';

import type { IncidentSummary } from '@incidents/shared';

import { incidentsCopy } from '@/features/incidents/incidents.copy';

import { IncidentsTableRow } from './IncidentsTableRow';

interface IncidentsTableProps {
  readonly incidents: readonly IncidentSummary[];
}

const COLUMN_LABELS = [
  incidentsCopy.columns.folio,
  incidentsCopy.columns.category,
  incidentsCopy.columns.description,
  incidentsCopy.columns.location,
  incidentsCopy.columns.status,
  incidentsCopy.columns.assignee,
  incidentsCopy.columns.sla,
];

export function IncidentsTable({ incidents }: IncidentsTableProps): ReactElement {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs md:block">
      <table className="min-w-full divide-y divide-slate-200">
        <caption className="sr-only">{incidentsCopy.inbox.tableCaption}</caption>
        <thead className="bg-slate-50">
          <tr>
            {COLUMN_LABELS.map((label) => (
              <th
                key={label}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {incidents.map((incident) => (
            <IncidentsTableRow key={incident.id} incident={incident} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
