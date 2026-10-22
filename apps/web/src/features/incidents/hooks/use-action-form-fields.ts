import { useState } from 'react';

import { NOTE_MIN_LENGTH } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';

export interface ActionFieldErrors {
  readonly note?: string;
  readonly assigneeId?: string;
}

export interface ActionFormFields {
  readonly note: string;
  readonly assigneeId: string;
  readonly errors: ActionFieldErrors;
  readonly setNote: (note: string) => void;
  readonly setAssigneeId: (assigneeId: string) => void;
  readonly validate: () => boolean;
}

function collectErrors(
  note: string,
  assigneeId: string,
  requiresAssignee: boolean,
): ActionFieldErrors {
  const copy = incidentDetailCopy.dialogs;
  return {
    ...(note.trim().length < NOTE_MIN_LENGTH ? { note: copy.noteTooShort(NOTE_MIN_LENGTH) } : {}),
    ...(requiresAssignee && assigneeId.length === 0 ? { assigneeId: copy.assigneeRequired } : {}),
  };
}

export function useActionFormFields(requiresAssignee: boolean): ActionFormFields {
  const [note, setNote] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [errors, setErrors] = useState<ActionFieldErrors>({});

  return {
    note,
    assigneeId,
    errors,
    setNote,
    setAssigneeId,
    validate: () => {
      const nextErrors = collectErrors(note, assigneeId, requiresAssignee);
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    },
  };
}
