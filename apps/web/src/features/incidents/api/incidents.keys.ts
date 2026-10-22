import type { ListIncidentsQuery } from '@incidents/shared';

export const incidentsKeys = {
  all: ['incidents'] as const,
  list: (query: ListIncidentsQuery) => [...incidentsKeys.all, 'list', query] as const,
  detail: (incidentId: string) => [...incidentsKeys.all, 'detail', incidentId] as const,
};

export const catalogsKeys = {
  all: ['catalogs'] as const,
};

export const assignableUsersKeys = {
  all: ['assignable-users'] as const,
};
