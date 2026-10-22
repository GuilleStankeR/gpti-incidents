import { DEFAULT_PAGE, INCIDENT_STATUSES } from '@incidents/shared';
import type { IncidentStatus } from '@incidents/shared';

export interface IncidentFilters {
  readonly status?: IncidentStatus;
  readonly category?: string;
  readonly from?: string;
  readonly to?: string;
  readonly search?: string;
  readonly page: number;
}

export type FilterKey = Exclude<keyof IncidentFilters, 'page'>;
export type FilterChanges = Partial<Record<FilterKey, string | undefined>>;

export const FILTER_KEYS: readonly FilterKey[] = ['status', 'category', 'from', 'to', 'search'];
export const PAGE_PARAM = 'page';

function readOptional(params: URLSearchParams, key: string): string | undefined {
  const value = params.get(key);
  return value === null || value.length === 0 ? undefined : value;
}

function readStatus(params: URLSearchParams): IncidentStatus | undefined {
  const status = readOptional(params, 'status');
  return INCIDENT_STATUSES.find((candidate) => candidate === status);
}

function readPage(params: URLSearchParams): number {
  const page = Number(params.get(PAGE_PARAM));
  return Number.isInteger(page) && page >= DEFAULT_PAGE ? page : DEFAULT_PAGE;
}

export function readFilters(params: URLSearchParams): IncidentFilters {
  return {
    status: readStatus(params),
    category: readOptional(params, 'category'),
    from: readOptional(params, 'from'),
    to: readOptional(params, 'to'),
    search: readOptional(params, 'search'),
    page: readPage(params),
  };
}

export function applyFilterChanges(
  current: URLSearchParams,
  changes: FilterChanges,
): URLSearchParams {
  const next = new URLSearchParams(current);

  for (const key of FILTER_KEYS.filter((filterKey) => filterKey in changes)) {
    const value = changes[key];
    if (value === undefined || value.length === 0) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }

  next.delete(PAGE_PARAM);
  return next;
}

export function withPage(current: URLSearchParams, page: number): URLSearchParams {
  const next = new URLSearchParams(current);
  next.set(PAGE_PARAM, String(page));
  return next;
}
