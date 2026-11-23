import { SuggestionConfidence } from '@incidents/shared';
import type { CatalogCategory, CategorySuggestion } from '@incidents/shared';

import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { formatList } from '@/shared/lib/format';

const MAX_DISPLAYED_TERMS = 4;

export interface CategorySuggestionTexts {
  readonly applied: string;
  readonly overridden: string;
}

export function describeCategorySuggestion(
  suggestion: CategorySuggestion | null,
  categories: readonly CatalogCategory[],
): CategorySuggestionTexts {
  const copy = reportIncidentCopy.fields.suggestion;
  const terms = formatList(
    (suggestion?.matchedTerms ?? []).slice(0, MAX_DISPLAYED_TERMS).map(copy.quotedTerm),
  );
  const suggestedName =
    categories.find((category) => category.code === suggestion?.categoryCode)?.name ?? '';
  const isHighConfidence = suggestion?.confidence === SuggestionConfidence.HIGH;

  return {
    applied: isHighConfidence ? copy.applied(terms) : copy.probable(terms),
    overridden: copy.overridden(suggestedName),
  };
}
