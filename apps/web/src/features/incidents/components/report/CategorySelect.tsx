import type { ReactElement } from 'react';

import type { CatalogCategory } from '@incidents/shared';

import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { SelectField } from '@/shared/ui/SelectField';

interface CategorySelectProps {
  readonly categories: readonly CatalogCategory[];
  readonly value: string;
  readonly error?: string;
  readonly onChange: (categoryCode: string) => void;
}

export function CategorySelect({
  categories,
  value,
  error,
  onChange,
}: CategorySelectProps): ReactElement {
  const selected = categories.find((category) => category.code === value);

  return (
    <SelectField
      label={reportIncidentCopy.fields.category}
      placeholder={reportIncidentCopy.fields.categoryPlaceholder}
      options={categories.map((category) => ({ value: category.code, label: category.name }))}
      value={value}
      error={error}
      hint={
        selected === undefined ? undefined : reportIncidentCopy.fields.slaHint(selected.slaHours)
      }
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
