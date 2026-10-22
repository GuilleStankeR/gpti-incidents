import { useId } from 'react';
import type { ReactElement, SelectHTMLAttributes } from 'react';

import { classNames } from '@/shared/lib/class-names';

import { controlClassNames, describedByIds } from './field-styles';
import { FieldShell } from './FieldShell';
import { Icon } from './icons/Icon';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'className' | 'id' | 'children'
> {
  readonly label: string;
  readonly options: readonly SelectOption[];
  readonly placeholder?: string;
  readonly hint?: string;
  readonly error?: string;
}

export function SelectField({
  label,
  options,
  placeholder,
  hint,
  error,
  ...selectAttributes
}: SelectFieldProps): ReactElement {
  const fieldId = useId();
  const hasError = error !== undefined;

  return (
    <FieldShell fieldId={fieldId} label={label} hint={hint} error={error}>
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={hasError}
          aria-describedby={describedByIds(fieldId, hasError || hint !== undefined)}
          className={classNames(controlClassNames(hasError), 'appearance-none pr-10')}
          {...selectAttributes}
        >
          {placeholder === undefined ? null : <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <Icon name="chevronDown" size="sm" />
        </span>
      </div>
    </FieldShell>
  );
}
