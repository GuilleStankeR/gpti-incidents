import { ROUTE_PATHS } from '@/shared/routing/route-paths';

export const REPORT_LINK_PARAMS = {
  condominium: 'condominium',
  location: 'location',
} as const;

export function buildReportLink(origin: string, condominiumCode: string, location: string): string {
  const url = new URL(ROUTE_PATHS.newIncident, origin);
  url.searchParams.set(REPORT_LINK_PARAMS.condominium, condominiumCode);

  if (location.length > 0) {
    url.searchParams.set(REPORT_LINK_PARAMS.location, location);
  }

  return url.toString();
}
