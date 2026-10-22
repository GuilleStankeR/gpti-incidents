import type { ReactElement } from 'react';

import { useActionFormFields } from '@/features/incidents/hooks/use-action-form-fields';
import { useReassignIncident } from '@/features/incidents/hooks/use-incident-mutations';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { getErrorMessage } from '@/shared/api/error-message';

import { AssigneeSelect } from './AssigneeSelect';
import { DialogFooter } from './DialogFooter';
import { NoteField } from './NoteField';

interface ReassignFormProps {
  readonly incidentId: string;
  readonly onDone: () => void;
}

export function ReassignForm({ incidentId, onDone }: ReassignFormProps): ReactElement {
  const fields = useActionFormFields(true);
  const mutation = useReassignIncident(incidentId);

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!fields.validate()) {
          return;
        }
        mutation.mutate(
          { assigneeId: fields.assigneeId, note: fields.note.trim() },
          { onSuccess: onDone },
        );
      }}
    >
      <AssigneeSelect
        value={fields.assigneeId}
        error={fields.errors.assigneeId}
        onChange={fields.setAssigneeId}
      />
      <NoteField value={fields.note} error={fields.errors.note} onChange={fields.setNote} />
      <DialogFooter
        confirmLabel={incidentDetailCopy.actions.reassign}
        confirmVariant="primary"
        isSubmitting={mutation.isPending}
        errorMessage={mutation.isError ? getErrorMessage(mutation.error) : null}
        onCancel={onDone}
      />
    </form>
  );
}
