import type { ReactElement } from 'react';

import type { IncidentStatus } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { transitionButtonVariant } from '@/features/incidents/presentation/transition-actions';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';

interface TransitionButtonsProps {
  readonly transitions: readonly IncidentStatus[];
  readonly canReassign: boolean;
  readonly onTransition: (target: IncidentStatus) => void;
  readonly onReassign: () => void;
}

export function TransitionButtons({
  transitions,
  canReassign,
  onTransition,
  onReassign,
}: TransitionButtonsProps): ReactElement {
  return (
    <>
      {transitions.map((target) => (
        <Button
          key={target}
          variant={transitionButtonVariant(target)}
          isFullWidth
          onClick={() => {
            onTransition(target);
          }}
        >
          {incidentDetailCopy.actions.transitions[target]}
        </Button>
      ))}
      {canReassign ? (
        <Button variant="secondary" isFullWidth onClick={onReassign}>
          <Icon name="swap" size="sm" />
          {incidentDetailCopy.actions.reassign}
        </Button>
      ) : null}
    </>
  );
}
