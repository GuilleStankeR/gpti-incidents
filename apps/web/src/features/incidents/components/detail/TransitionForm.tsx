import type { ReactElement } from 'react';

import type { IncidentStatus } from '@incidents/shared';

import { useTransitionForm } from '@/features/incidents/hooks/use-transition-form';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { transitionButtonVariant } from '@/features/incidents/presentation/transition-actions';

import { AssigneeSelect } from './AssigneeSelect';
import { DialogFooter } from './DialogFooter';
import { NoteField } from './NoteField';

interface TransitionFormProps {
  readonly incidentId: string;
  readonly target: IncidentStatus;
  readonly onDone: () => void;
}

export function TransitionForm({ incidentId, target, onDone }: TransitionFormProps): ReactElement {
  const form = useTransitionForm(incidentId, target, onDone);
  const { fields } = form;

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={form.submit}>
      {form.isAssigneeRequired ? (
        <AssigneeSelect
          value={fields.assigneeId}
          error={fields.errors.assigneeId}
          onChange={fields.setAssigneeId}
        />
      ) : null}
      <NoteField value={fields.note} error={fields.errors.note} onChange={fields.setNote} />
      <DialogFooter
        confirmLabel={incidentDetailCopy.actions.transitions[target]}
        confirmVariant={transitionButtonVariant(target)}
        isSubmitting={form.isSubmitting}
        errorMessage={form.errorMessage}
        onCancel={onDone}
      />
    </form>
  );
}
