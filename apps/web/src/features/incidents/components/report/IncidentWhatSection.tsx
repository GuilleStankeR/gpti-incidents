import type { ReactElement } from 'react';

import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH } from '@incidents/shared';
import type { CatalogCategory } from '@incidents/shared';

import type { ReportIncidentFormState } from '@/features/incidents/hooks/use-report-incident-form';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { FormSection } from '@/shared/ui/FormSection';
import { TextAreaField } from '@/shared/ui/TextAreaField';

import { CategorySelect } from './CategorySelect';
import { CategorySuggestionHint } from './CategorySuggestionHint';

interface IncidentWhatSectionProps {
  readonly form: ReportIncidentFormState;
  readonly categories: readonly CatalogCategory[];
}

export function IncidentWhatSection({ form, categories }: IncidentWhatSectionProps): ReactElement {
  const { sections, fields } = reportIncidentCopy;

  return (
    <FormSection step={1} title={sections.what.title} description={sections.what.description}>
      <TextAreaField
        label={fields.description}
        placeholder={fields.descriptionPlaceholder}
        hint={fields.descriptionHint(DESCRIPTION_MIN_LENGTH)}
        maxLength={DESCRIPTION_MAX_LENGTH}
        rows={5}
        value={form.values.description}
        error={form.errors.description}
        onChange={(event) => {
          form.setValue('description', event.target.value);
        }}
      />
      <div className="flex flex-col gap-2">
        <CategorySelect
          categories={categories}
          value={form.values.categoryCode}
          error={form.errors.categoryCode}
          onChange={form.category.choose}
        />
        <CategorySuggestionHint category={form.category} categories={categories} />
      </div>
    </FormSection>
  );
}
