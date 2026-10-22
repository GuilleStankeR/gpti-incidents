import type { ReactElement } from 'react';

import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

interface IncidentsEmptyStateProps {
  readonly hasActiveFilters: boolean;
  readonly onClearFilters: () => void;
}

export function IncidentsEmptyState({
  hasActiveFilters,
  onClearFilters,
}: IncidentsEmptyStateProps): ReactElement {
  if (hasActiveFilters) {
    return (
      <EmptyState
        icon="search"
        title={incidentsCopy.empty.filteredTitle}
        description={incidentsCopy.empty.filteredDescription}
        action={
          <Button variant="secondary" onClick={onClearFilters}>
            {incidentsCopy.filters.clear}
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState title={incidentsCopy.empty.title} description={incidentsCopy.empty.description} />
  );
}
