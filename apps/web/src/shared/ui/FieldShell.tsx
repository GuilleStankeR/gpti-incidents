import type { ReactElement, ReactNode } from 'react';

import { describedByIds } from './field-styles';

interface FieldShellProps {
  readonly fieldId: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly aside?: ReactNode;
  readonly children: ReactNode;
}

export function FieldShell({
  fieldId,
  label,
  hint,
  error,
  aside,
  children,
}: FieldShellProps): ReactElement {
  const description = error ?? hint;
  const descriptionId = describedByIds(fieldId, description !== undefined);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={fieldId} className="text-sm font-medium text-slate-800">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {description === undefined ? null : (
        <p
          id={descriptionId}
          className={error === undefined ? 'text-sm text-slate-500' : 'text-sm text-red-700'}
        >
          {description}
        </p>
      )}
    </div>
  );
}
