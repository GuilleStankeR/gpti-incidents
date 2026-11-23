import type { ReactElement } from 'react';

import { QrCodeControls } from '@/features/incidents/components/qr/QrCodeControls';
import { QrPosterCard } from '@/features/incidents/components/qr/QrPosterCard';
import { useCatalogs } from '@/features/incidents/hooks/use-catalogs';
import { useReportQrCode } from '@/features/incidents/hooks/use-report-qr-code';
import { qrCodesCopy } from '@/features/incidents/qr-codes.copy';
import { getErrorMessage } from '@/shared/api/error-message';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

export function QrCodesPage(): ReactElement {
  const catalogsQuery = useCatalogs();
  const qrCode = useReportQrCode();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="print:hidden">
        <PageHeader title={qrCodesCopy.title} description={qrCodesCopy.description} />
      </div>
      {catalogsQuery.isPending ? <LoadingState /> : null}
      {catalogsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(catalogsQuery.error)}
          onRetry={() => void catalogsQuery.refetch()}
        />
      ) : null}
      {catalogsQuery.isSuccess ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] print:block">
          <QrCodeControls qrCode={qrCode} locations={catalogsQuery.data.locations} />
          <QrPosterCard qrCode={qrCode} />
        </div>
      ) : null}
    </div>
  );
}
