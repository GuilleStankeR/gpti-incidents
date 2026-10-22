import { useId } from 'react';
import type { InputHTMLAttributes, ReactElement } from 'react';

import { classNames } from '@/shared/lib/class-names';

import { controlClassNames } from './field-styles';
import { FieldShell } from './FieldShell';
import { Icon } from './icons/Icon';

interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id' | 'type'
> {
  readonly label: string;
}

export function SearchField({ label, ...inputAttributes }: SearchFieldProps): ReactElement {
  const fieldId = useId();

  return (
    <FieldShell fieldId={fieldId} label={label}>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Icon name="search" size="sm" />
        </span>
        <input
          id={fieldId}
          type="search"
          className={classNames(controlClassNames(false), 'pl-9')}
          {...inputAttributes}
        />
      </div>
    </FieldShell>
  );
}
