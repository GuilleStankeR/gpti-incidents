import { useId } from 'react';
import type { ReactElement, TextareaHTMLAttributes } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';
import { classNames } from '@/shared/lib/class-names';

import { controlClassNames, describedByIds } from './field-styles';
import { FieldShell } from './FieldShell';

interface TextAreaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className' | 'id' | 'value'
> {
  readonly label: string;
  readonly value: string;
  readonly maxLength: number;
  readonly hint?: string;
  readonly error?: string;
}

export function TextAreaField({
  label,
  value,
  maxLength,
  hint,
  error,
  ...textAreaAttributes
}: TextAreaFieldProps): ReactElement {
  const fieldId = useId();
  const hasError = error !== undefined;
  const counter = (
    <span className="text-xs text-slate-500 tabular-nums">
      {commonCopy.characterCount(value.length, maxLength)}
    </span>
  );

  return (
    <FieldShell fieldId={fieldId} label={label} hint={hint} error={error} aside={counter}>
      <textarea
        id={fieldId}
        value={value}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={describedByIds(fieldId, hasError || hint !== undefined)}
        className={classNames(controlClassNames(hasError), 'min-h-28 resize-y py-2.5')}
        {...textAreaAttributes}
      />
    </FieldShell>
  );
}
