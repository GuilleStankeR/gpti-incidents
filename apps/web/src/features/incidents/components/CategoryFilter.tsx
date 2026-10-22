import type { ReactElement } from 'react';

import { useCatalogs } from '@/features/incidents/hooks/use-catalogs';
import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { SelectField } from '@/shared/ui/SelectField';

interface CategoryFilterProps {
  readonly value: string | undefined;
  readonly onChange: (category: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps): ReactElement {
  const categories = useCatalogs().data?.categories ?? [];

  return (
    <SelectField
      label={incidentsCopy.filters.categoryLabel}
      placeholder={incidentsCopy.filters.allCategoriesOption}
      options={categories.map((category) => ({ value: category.code, label: category.name }))}
      value={value ?? ''}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
