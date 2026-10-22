import { useId } from 'react';
import type { InputHTMLAttributes, ReactElement } from 'react';

import { controlClassNames, describedByIds } from './field-styles';
import { FieldShell } from './FieldShell';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
}

export function TextField({
  label,
  hint,
  error,
  ...inputAttributes
}: TextFieldProps): ReactElement {
  const fieldId = useId();
  const hasError = error !== undefined;

  return (
    <FieldShell fieldId={fieldId} label={label} hint={hint} error={error}>
      <input
        id={fieldId}
        aria-invalid={hasError}
        aria-describedby={describedByIds(fieldId, hasError || hint !== undefined)}
        className={controlClassNames(hasError)}
        {...inputAttributes}
      />
    </FieldShell>
  );
}
