import type { ListIncidentsQuery, PossibleDuplicatesQuery } from '@incidents/shared';

export const incidentsKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentsKeys.all, 'list'] as const,
  list: (query: ListIncidentsQuery) => [...incidentsKeys.lists(), query] as const,
  detail: (incidentId: string) => [...incidentsKeys.all, 'detail', incidentId] as const,
  possibleDuplicates: (query: PossibleDuplicatesQuery) =>
    [...incidentsKeys.all, 'possible-duplicates', query] as const,
  assigneeSuggestion: (incidentId: string) =>
    [...incidentsKeys.all, 'assignee-suggestion', incidentId] as const,
};

export const catalogsKeys = {
  all: ['catalogs'] as const,
};

export const assignableUsersKeys = {
  all: ['assignable-users'] as const,
};

export const evidenceKeys = {
  image: (url: string) => ['evidence-image', url] as const,
};
