import type { ReactElement } from 'react';

import type { CatalogCategory } from '@incidents/shared';

import type { CategorySuggestionState } from '@/features/incidents/hooks/use-category-suggestion';
import { describeCategorySuggestion } from '@/features/incidents/presentation/category-suggestion-presentation';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';

interface CategorySuggestionHintProps {
  readonly category: CategorySuggestionState;
  readonly categories: readonly CatalogCategory[];
}

export function CategorySuggestionHint({
  category,
  categories,
}: CategorySuggestionHintProps): ReactElement {
  const copy = reportIncidentCopy.fields.suggestion;
  const texts = describeCategorySuggestion(category.suggestion, categories);

  return (
    <div aria-live="polite" className="text-sm">
      {category.status === 'idle' ? <p className="text-slate-500">{copy.idle}</p> : null}
      {category.status === 'applied' ? (
        <p className="flex items-start gap-2 rounded-md bg-accent-muted px-3 py-2 text-accent">
          <Icon name="sparkles" size="sm" />
          <span>{texts.applied}</span>
        </p>
      ) : null}
      {category.status === 'overridden' ? (
        <div className="flex flex-col items-start gap-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-slate-700">
            <Icon name="sparkles" size="sm" />
            <span>{texts.overridden}</span>
          </p>
          <Button variant="ghost" onClick={category.applySuggestion}>
            {copy.apply}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
