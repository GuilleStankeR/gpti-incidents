import type { ReactElement } from 'react';

import type { IncidentSummary } from '@incidents/shared';

import { IncidentCard } from './IncidentCard';

interface IncidentCardListProps {
  readonly incidents: readonly IncidentSummary[];
}

export function IncidentCardList({ incidents }: IncidentCardListProps): ReactElement {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {incidents.map((incident) => (
        <li key={incident.id}>
          <IncidentCard incident={incident} />
        </li>
      ))}
    </ul>
  );
}
