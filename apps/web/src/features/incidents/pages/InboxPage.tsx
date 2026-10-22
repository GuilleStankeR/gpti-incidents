import type { ReactElement } from 'react';

import { InboxResults } from '@/features/incidents/components/inbox/InboxResults';
import { IncidentFiltersBar } from '@/features/incidents/components/inbox/IncidentFiltersBar';
import { useIncidentFilters } from '@/features/incidents/hooks/use-incident-filters';
import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { Icon } from '@/shared/ui/icons/Icon';
import { PageHeader } from '@/shared/ui/PageHeader';

export function InboxPage(): ReactElement {
  const filtersState = useIncidentFilters();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={incidentsCopy.inbox.title}
        description={incidentsCopy.inbox.description}
        actions={
          <ButtonLink to={ROUTE_PATHS.newIncident}>
            <Icon name="plus" size="sm" />
            {incidentsCopy.inbox.reportAction}
          </ButtonLink>
        }
      />
      <IncidentFiltersBar state={filtersState} />
      <InboxResults state={filtersState} />
    </div>
  );
}
