import type { ReactElement } from 'react';

import type { IncidentFiltersState } from '@/features/incidents/hooks/use-incident-filters';
import { useIncidents } from '@/features/incidents/hooks/use-incidents';
import { getErrorMessage } from '@/shared/api/error-message';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { Pagination } from '@/shared/ui/Pagination';

import { IncidentCardList } from './IncidentCardList';
import { IncidentsEmptyState } from './IncidentsEmptyState';
import { IncidentsTable } from './IncidentsTable';

interface InboxResultsProps {
  readonly state: IncidentFiltersState;
}

export function InboxResults({ state }: InboxResultsProps): ReactElement {
  const incidentsQuery = useIncidents(state.filters);

  if (incidentsQuery.isPending) {
    return <LoadingState />;
  }

  if (incidentsQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(incidentsQuery.error)}
        onRetry={() => void incidentsQuery.refetch()}
      />
    );
  }

  const { items, total, page, pageSize } = incidentsQuery.data;

  if (items.length === 0) {
    return (
      <IncidentsEmptyState
        hasActiveFilters={state.hasActiveFilters}
        onClearFilters={state.clearFilters}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <IncidentsTable incidents={items} />
      <IncidentCardList incidents={items} />
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={state.setPage} />
    </div>
  );
}
