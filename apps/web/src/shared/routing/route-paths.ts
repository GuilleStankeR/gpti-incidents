export const ROUTE_PATHS = {
  home: '/',
  login: '/login',
  incidents: '/incidents',
  newIncident: '/incidents/new',
  incidentDetail: '/incidents/:incidentId',
  metrics: '/metrics',
  notFound: '*',
} as const;
