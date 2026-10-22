import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { SearchField } from '@/shared/ui/SearchField';

const SEARCH_DEBOUNCE_MS = 350;

interface SearchFilterProps {
  readonly committedValue: string | undefined;
  readonly onCommit: (search: string) => void;
}

export function SearchFilter({ committedValue, onCommit }: SearchFilterProps): ReactElement {
  const [text, setText] = useState(committedValue ?? '');
  const debouncedText = useDebouncedValue(text.trim(), SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedText !== (committedValue ?? '')) {
      onCommit(debouncedText);
    }
  }, [debouncedText, committedValue, onCommit]);

  return (
    <SearchField
      label={incidentsCopy.filters.searchLabel}
      placeholder={incidentsCopy.filters.searchPlaceholder}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
      }}
    />
  );
}
