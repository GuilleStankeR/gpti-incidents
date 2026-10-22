import type { ReactElement } from 'react';

import { TextField } from './TextField';

export interface DateRangeValue {
  readonly from?: string;
  readonly to?: string;
}

interface DateRangeFieldsProps {
  readonly fromLabel: string;
  readonly toLabel: string;
  readonly value: DateRangeValue;
  readonly onChange: (value: DateRangeValue) => void;
}

function toOptionalDate(value: string): string | undefined {
  return value.length > 0 ? value : undefined;
}

export function DateRangeFields({
  fromLabel,
  toLabel,
  value,
  onChange,
}: DateRangeFieldsProps): ReactElement {
  return (
    <>
      <TextField
        label={fromLabel}
        type="date"
        value={value.from ?? ''}
        max={value.to}
        onChange={(event) => {
          onChange({ ...value, from: toOptionalDate(event.target.value) });
        }}
      />
      <TextField
        label={toLabel}
        type="date"
        value={value.to ?? ''}
        min={value.from}
        onChange={(event) => {
          onChange({ ...value, to: toOptionalDate(event.target.value) });
        }}
      />
    </>
  );
}
