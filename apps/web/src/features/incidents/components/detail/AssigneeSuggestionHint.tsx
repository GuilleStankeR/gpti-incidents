import type { ReactElement } from 'react';

import type { AssigneeSuggestion } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { describeAssigneeSuggestion } from '@/features/incidents/presentation/assignee-suggestion-presentation';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';

interface AssigneeSuggestionHintProps {
  readonly suggestion: AssigneeSuggestion | null;
  readonly assigneeId: string;
  readonly onApply: (assigneeId: string) => void;
}

export function AssigneeSuggestionHint({
  suggestion,
  assigneeId,
  onApply,
}: AssigneeSuggestionHintProps): ReactElement {
  const presentation = describeAssigneeSuggestion(suggestion, assigneeId);

  return (
    <div aria-live="polite" className="text-sm">
      {presentation.status === 'applied' ? (
        <p className="flex items-start gap-2 rounded-md bg-accent-muted px-3 py-2 text-accent">
          <Icon name="sparkles" size="sm" />
          <span>{presentation.text}</span>
        </p>
      ) : null}
      {presentation.status === 'overridden' && suggestion !== null ? (
        <div className="flex flex-col items-start gap-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="flex items-start gap-2 text-slate-700">
            <Icon name="sparkles" size="sm" />
            <span>{presentation.text}</span>
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              onApply(suggestion.assignee.id);
            }}
          >
            {incidentDetailCopy.dialogs.assigneeSuggestion.apply}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
