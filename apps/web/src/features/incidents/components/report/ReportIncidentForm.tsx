import type { ReactElement } from 'react';

import type { CatalogsResponse } from '@incidents/shared';

import { hasErrors } from '@/features/incidents/hooks/report-incident-validation';
import { useReportIncidentForm } from '@/features/incidents/hooks/use-report-incident-form';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { FormSection } from '@/shared/ui/FormSection';

import { IncidentWhatSection } from './IncidentWhatSection';
import { IncidentWhereWhenSection } from './IncidentWhereWhenSection';
import { PhotoPicker } from './PhotoPicker';
import { ReportFormActions } from './ReportFormActions';

interface ReportIncidentFormProps {
  readonly catalogs: CatalogsResponse;
}

export function ReportIncidentForm({ catalogs }: ReportIncidentFormProps): ReactElement {
  const form = useReportIncidentForm(catalogs);
  const { photos: photosSection } = reportIncidentCopy.sections;

  return (
    <form className="flex flex-col gap-5" onSubmit={form.submit} noValidate>
      <IncidentWhatSection form={form} categories={catalogs.categories} />
      <IncidentWhereWhenSection form={form} locations={catalogs.locations} />
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
