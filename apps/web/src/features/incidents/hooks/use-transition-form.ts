import type { FormEvent } from 'react';

import type { IncidentStatus } from '@incidents/shared';

import { requiresAssignee } from '@/features/incidents/presentation/transition-actions';
import { getErrorMessage } from '@/shared/api/error-message';

import { useActionFormFields } from './use-action-form-fields';
import type { ActionFormFields } from './use-action-form-fields';
import { useTransitionIncident } from './use-incident-mutations';

export interface TransitionFormState {
  readonly fields: ActionFormFields;
  readonly isAssigneeRequired: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly submit: (event: FormEvent<HTMLFormElement>) => void;
}

export function useTransitionForm(
  incidentId: string,
  target: IncidentStatus,
  onDone: () => void,
): TransitionFormState {
  const isAssigneeRequired = requiresAssignee(target);
  const fields = useActionFormFields(isAssigneeRequired);
  const mutation = useTransitionIncident(incidentId);

  return {
    fields,
    isAssigneeRequired,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.isError ? getErrorMessage(mutation.error) : null,
    submit: (event) => {
      event.preventDefault();
      if (!fields.validate()) {
        return;
      }
      mutation.mutate(
        {
          targetStatus: target,
          assigneeId: isAssigneeRequired ? fields.assigneeId : undefined,
          note: fields.note.trim(),
        },
        { onSuccess: onDone },
      );
    },
  };
}
