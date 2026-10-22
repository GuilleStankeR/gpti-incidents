import type { ReactElement } from 'react';

import type { IncidentDetail, IncidentStatus } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { statusLabels } from '@/shared/copy/domain-labels.copy';
import { Modal } from '@/shared/ui/Modal';

import { ReassignForm } from './ReassignForm';
import { TransitionForm } from './TransitionForm';

export type ActiveDialog =
  { readonly kind: 'transition'; readonly target: IncidentStatus } | { readonly kind: 'reassign' };

interface IncidentActionDialogsProps {
  readonly incident: IncidentDetail;
  readonly activeDialog: ActiveDialog | null;
  readonly onClose: () => void;
}

export function IncidentActionDialogs({
  incident,
  activeDialog,
  onClose,
}: IncidentActionDialogsProps): ReactElement {
  const transitionTarget = activeDialog?.kind === 'transition' ? activeDialog.target : null;
  const copy = incidentDetailCopy;

  return (
    <>
      <Modal
        isOpen={transitionTarget !== null}
        title={transitionTarget === null ? '' : copy.actions.transitions[transitionTarget]}
        description={
          transitionTarget === null
            ? undefined
            : copy.dialogs.transitionDescription(
                statusLabels[incident.status],
                statusLabels[transitionTarget],
              )
        }
        onClose={onClose}
      >
        {transitionTarget === null ? null : (
          <TransitionForm incidentId={incident.id} target={transitionTarget} onDone={onClose} />
        )}
      </Modal>
      <Modal
        isOpen={activeDialog?.kind === 'reassign'}
        title={copy.actions.reassign}
        description={copy.dialogs.reassignDescription}
        onClose={onClose}
      >
        <ReassignForm incidentId={incident.id} onDone={onClose} />
      </Modal>
    </>
  );
}
