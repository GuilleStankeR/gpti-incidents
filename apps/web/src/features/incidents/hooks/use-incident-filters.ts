import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FILTER_KEYS, applyFilterChanges, readFilters, withPage } from './incident-filters-params';
import type { FilterChanges, IncidentFilters } from './incident-filters-params';

export interface IncidentFiltersState {
  readonly filters: IncidentFilters;
  readonly hasActiveFilters: boolean;
  readonly resetToken: number;
  readonly setFilters: (changes: FilterChanges) => void;
  readonly setSearch: (search: string) => void;
  readonly setPage: (page: number) => void;
  readonly clearFilters: () => void;
}

export function useIncidentFilters(): IncidentFiltersState {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resetToken, setResetToken] = useState(0);
  const filters = readFilters(searchParams);

  const setFilters = useCallback(
    (changes: FilterChanges) => {
      setSearchParams((current) => applyFilterChanges(current, changes), { replace: true });
    },
    [setSearchParams],
  );

  const setSearch = useCallback(
    (search: string) => {
      setFilters({ search });
    },
    [setFilters],
  );

  return {
    filters,
    hasActiveFilters: FILTER_KEYS.some((key) => filters[key] !== undefined),
    resetToken,
    setFilters,
    setSearch,
    setPage: (page) => {
      setSearchParams((current) => withPage(current, page));
      window.scrollTo({ top: 0 });
    },
    clearFilters: () => {
      setResetToken((token) => token + 1);
      setSearchParams(new URLSearchParams(), { replace: true });
    },
  };
}
