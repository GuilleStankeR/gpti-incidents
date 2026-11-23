import type { ReactElement } from 'react';

import type { CatalogsResponse } from '@incidents/shared';

import { hasErrors } from '@/features/incidents/hooks/report-incident-validation';
import { usePossibleDuplicates } from '@/features/incidents/hooks/use-possible-duplicates';
import { useReportIncidentForm } from '@/features/incidents/hooks/use-report-incident-form';
import { useReportPrefill } from '@/features/incidents/hooks/use-report-prefill';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { FormSection } from '@/shared/ui/FormSection';

import { IncidentWhatSection } from './IncidentWhatSection';
import { IncidentWhereWhenSection } from './IncidentWhereWhenSection';
import { PhotoPicker } from './PhotoPicker';
import { PossibleDuplicateNotice } from './PossibleDuplicateNotice';
import { ReportFormActions } from './ReportFormActions';
import { ReportPrefillNotice } from './ReportPrefillNotice';

interface ReportIncidentFormProps {
  readonly catalogs: CatalogsResponse;
}

export function ReportIncidentForm({ catalogs }: ReportIncidentFormProps): ReactElement {
  const prefill = useReportPrefill(catalogs.locations);
  const form = useReportIncidentForm(catalogs, prefill.location);
  const possibleDuplicates = usePossibleDuplicates(form.values.categoryCode, form.values.location);
  const { photos: photosSection } = reportIncidentCopy.sections;

  return (
    <form className="flex flex-col gap-5" onSubmit={form.submit} noValidate>
      <ReportPrefillNotice prefill={prefill} />
      <IncidentWhatSection form={form} categories={catalogs.categories} />
      <IncidentWhereWhenSection form={form} locations={catalogs.locations} />
      <PossibleDuplicateNotice result={possibleDuplicates} />
      <FormSection step={3} title={photosSection.title} description={photosSection.description}>
        <PhotoPicker selection={form.photos} />
      </FormSection>
      <ReportFormActions
        isSubmitting={form.isSubmitting}
        submitError={form.submitError}
        hasValidationErrors={hasErrors(form.errors)}
      />
    </form>
  );
}
