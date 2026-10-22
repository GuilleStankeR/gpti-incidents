import type { ReactElement } from 'react';

import { NOTE_MAX_LENGTH, NOTE_MIN_LENGTH } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { TextAreaField } from '@/shared/ui/TextAreaField';

interface NoteFieldProps {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (note: string) => void;
}

export function NoteField({ value, error, onChange }: NoteFieldProps): ReactElement {
  const copy = incidentDetailCopy.dialogs;

  return (
    <TextAreaField
      label={copy.note}
      placeholder={copy.notePlaceholder}
      hint={copy.noteHint(NOTE_MIN_LENGTH)}
      maxLength={NOTE_MAX_LENGTH}
      rows={4}
      value={value}
      error={error}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
