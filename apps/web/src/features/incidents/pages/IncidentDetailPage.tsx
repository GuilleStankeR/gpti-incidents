import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { IncidentDetailView } from '@/features/incidents/components/detail/IncidentDetailView';
import { useIncident } from '@/features/incidents/hooks/use-incident';
import { getErrorMessage } from '@/shared/api/error-message';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

export function IncidentDetailPage(): ReactElement {
  const { incidentId = '' } = useParams();
  const incidentQuery = useIncident(incidentId);

  if (incidentQuery.isPending) {
    return <LoadingState />;
  }

  if (incidentQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(incidentQuery.error)}
        onRetry={() => void incidentQuery.refetch()}
      />
    );
  }

  return <IncidentDetailView incident={incidentQuery.data} />;
}
