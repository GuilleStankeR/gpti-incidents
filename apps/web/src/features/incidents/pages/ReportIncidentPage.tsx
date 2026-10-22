import type { ReactElement } from 'react';

import { ReportIncidentForm } from '@/features/incidents/components/report/ReportIncidentForm';
import { useCatalogs } from '@/features/incidents/hooks/use-catalogs';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { getErrorMessage } from '@/shared/api/error-message';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Icon } from '@/shared/ui/icons/Icon';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

export function ReportIncidentPage(): ReactElement {
  const catalogsQuery = useCatalogs();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title={reportIncidentCopy.title}
        description={reportIncidentCopy.description}
        actions={
          <ButtonLink to={ROUTE_PATHS.incidents} variant="ghost">
            <Icon name="arrowLeft" size="sm" />
            {reportIncidentCopy.back}
          </ButtonLink>
        }
      />
      {catalogsQuery.isPending ? <LoadingState /> : null}
      {catalogsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(catalogsQuery.error)}
          onRetry={() => void catalogsQuery.refetch()}
        />
      ) : null}
      {catalogsQuery.isSuccess ? <ReportIncidentForm catalogs={catalogsQuery.data} /> : null}
    </div>
  );
}
