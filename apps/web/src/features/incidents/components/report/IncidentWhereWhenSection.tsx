import type { ReactElement } from 'react';

import { OCCURRED_AT_MAX_AGE_DAYS } from '@incidents/shared';

import type { ReportIncidentFormState } from '@/features/incidents/hooks/use-report-incident-form';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { FormSection } from '@/shared/ui/FormSection';
import { SelectField } from '@/shared/ui/SelectField';
import { TextField } from '@/shared/ui/TextField';

import { GeolocationField } from './GeolocationField';

interface IncidentWhereWhenSectionProps {
  readonly form: ReportIncidentFormState;
  readonly locations: readonly string[];
}

export function IncidentWhereWhenSection({
  form,
  locations,
}: IncidentWhereWhenSectionProps): ReactElement {
  const { sections, fields } = reportIncidentCopy;

  return (
    <FormSection
      step={2}
      title={sections.whereWhen.title}
      description={sections.whereWhen.description}
    >
      <SelectField
        label={fields.location}
        placeholder={fields.locationPlaceholder}
        options={locations.map((location) => ({ value: location, label: location }))}
        value={form.values.location}
        error={form.errors.location}
        onChange={(event) => {
          form.setValue('location', event.target.value);
        }}
      />
      <TextField
        label={fields.occurredAt}
        type="datetime-local"
        hint={fields.occurredAtHint(OCCURRED_AT_MAX_AGE_DAYS)}
        value={form.values.occurredAt}
        error={form.errors.occurredAt}
        onChange={(event) => {
          form.setValue('occurredAt', event.target.value);
        }}
      />
      <GeolocationField geolocation={form.geolocation} />
    </FormSection>
  );
}
