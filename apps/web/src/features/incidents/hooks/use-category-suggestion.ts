import { useState } from 'react';

import { suggestCategory } from '@incidents/shared';
import type { CategorySuggestion } from '@incidents/shared';

import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

const SUGGESTION_DEBOUNCE_MS = 400;

export type CategorySuggestionStatus = 'idle' | 'applied' | 'overridden' | 'hidden';

export interface CategorySuggestionInput {
  readonly description: string;
  readonly location: string;
}

export interface CategorySuggestionState {
  readonly categoryCode: string;
  readonly suggestion: CategorySuggestion | null;
  readonly status: CategorySuggestionStatus;
  readonly choose: (categoryCode: string) => void;
  readonly applySuggestion: () => void;
}

function resolveStatus(
  suggestion: CategorySuggestion | null,
  categoryCode: string,
  isManual: boolean,
): CategorySuggestionStatus {
  if (suggestion === null) {
    return isManual ? 'hidden' : 'idle';
  }

  return suggestion.categoryCode === categoryCode ? 'applied' : 'overridden';
}

export function useCategorySuggestion({
  description,
  location,
}: CategorySuggestionInput): CategorySuggestionState {
  const [manualCategoryCode, setManualCategoryCode] = useState<string | null>(null);
  const debouncedDescription = useDebouncedValue(description, SUGGESTION_DEBOUNCE_MS);
  const suggestion = suggestCategory({ description: debouncedDescription, location });
  const categoryCode = manualCategoryCode ?? suggestion?.categoryCode ?? '';

  return {
    categoryCode,
    suggestion,
    status: resolveStatus(suggestion, categoryCode, manualCategoryCode !== null),
    choose: (chosenCategoryCode) => {
      setManualCategoryCode(chosenCategoryCode.length === 0 ? null : chosenCategoryCode);
    },
    applySuggestion: () => {
      setManualCategoryCode(null);
    },
  };
}
