import type { ReactElement } from 'react';

import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { InlineAlert } from '@/shared/ui/InlineAlert';

interface ReportFormActionsProps {
  readonly isSubmitting: boolean;
  readonly submitError: string | null;
  readonly hasValidationErrors: boolean;
}

export function ReportFormActions({
  isSubmitting,
  submitError,
  hasValidationErrors,
}: ReportFormActionsProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {submitError === null ? null : (
        <InlineAlert tone="error" title={reportIncidentCopy.submitErrorTitle}>
          {submitError}
        </InlineAlert>
      )}
      {hasValidationErrors ? (
        <InlineAlert tone="warning">{reportIncidentCopy.errors.reviewFields}</InlineAlert>
      ) : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink to={ROUTE_PATHS.incidents} variant="secondary">
          {reportIncidentCopy.cancel}
        </ButtonLink>
        <Button type="submit" isLoading={isSubmitting}>
          {reportIncidentCopy.submit}
        </Button>
      </div>
    </div>
  );
}
