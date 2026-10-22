import type { ReactElement } from 'react';

import type { IncidentFiltersState } from '@/features/incidents/hooks/use-incident-filters';
import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { DateRangeFields } from '@/shared/ui/DateRangeFields';

import { CategoryFilter } from './CategoryFilter';
import { ClearFiltersFooter } from './ClearFiltersFooter';
import { SearchFilter } from './SearchFilter';
import { StatusFilter } from './StatusFilter';

interface IncidentFiltersBarProps {
  readonly state: IncidentFiltersState;
}

export function IncidentFiltersBar({ state }: IncidentFiltersBarProps): ReactElement {
  const { filters, setFilters } = state;
  const copy = incidentsCopy.filters;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 lg:col-span-1">
          <SearchFilter
            key={state.resetToken}
            committedValue={filters.search}
            onCommit={state.setSearch}
          />
        </div>
        <StatusFilter
          value={filters.status}
          onChange={(status) => {
            setFilters({ status });
          }}
        />
        <CategoryFilter
          value={filters.category}
          onChange={(category) => {
            setFilters({ category });
          }}
        />
        <DateRangeFields
          fromLabel={copy.fromLabel}
          toLabel={copy.toLabel}
          value={{ from: filters.from, to: filters.to }}
          onChange={setFilters}
        />
      </div>
      {state.hasActiveFilters ? <ClearFiltersFooter onClear={state.clearFilters} /> : null}
    </section>
  );
}
