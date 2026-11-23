import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { REPORT_LINK_PARAMS } from '@/features/incidents/presentation/report-link';

export type ReportPrefillStatus = 'none' | 'location' | 'otherCondominium';

export interface ReportPrefill {
  readonly location: string;
  readonly status: ReportPrefillStatus;
}

export function useReportPrefill(locations: readonly string[]): ReportPrefill {
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const condominiumCode = searchParams.get(REPORT_LINK_PARAMS.condominium);
  const requestedLocation = searchParams.get(REPORT_LINK_PARAMS.location) ?? '';

  if (condominiumCode !== null && condominiumCode !== session?.user.condominium.code) {
    return { location: '', status: 'otherCondominium' };
  }

  if (locations.includes(requestedLocation)) {
    return { location: requestedLocation, status: 'location' };
  }

  return { location: '', status: 'none' };
}
