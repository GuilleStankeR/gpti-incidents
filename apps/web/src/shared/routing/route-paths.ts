import { generatePath } from 'react-router-dom';

export const ROUTE_PATHS = {
  home: '/',
  login: '/login',
  incidents: '/incidents',
  newIncident: '/incidents/new',
  incidentDetail: '/incidents/:incidentId',
  metrics: '/metrics',
  notFound: '*',
} as const;

export function buildIncidentDetailPath(incidentId: string): string {
  return generatePath(ROUTE_PATHS.incidentDetail, { incidentId });
}
