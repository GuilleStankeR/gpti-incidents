import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { CreatedFolioNotice } from '@/features/incidents/components/detail/CreatedFolioNotice';
import { IncidentStatusBadge } from '@/features/incidents/components/IncidentStatusBadge';
import { useCreatedFolio } from '@/features/incidents/hooks/use-created-folio';
import { useIncident } from '@/features/incidents/hooks/use-incident';
import { getErrorMessage } from '@/shared/api/error-message';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

export function IncidentDetailPage(): ReactElement {
  const { incidentId = '' } = useParams();
  const incidentQuery = useIncident(incidentId);
  const createdFolio = useCreatedFolio();

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

  return (
    <div className="flex flex-col gap-6">
      {createdFolio === null ? null : <CreatedFolioNotice folio={createdFolio} />}
      <PageHeader
        title={incidentQuery.data.folio}
        actions={<IncidentStatusBadge status={incidentQuery.data.status} />}
      />
    </div>
  );
}
