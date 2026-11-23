import { ASSIGNEE_EXPERIENCE_WINDOW_DAYS } from '@incidents/shared';
import type { AssigneeSuggestion } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';

export type AssigneeSuggestionStatus = 'applied' | 'overridden' | 'hidden';

export interface AssigneeSuggestionPresentation {
  readonly status: AssigneeSuggestionStatus;
  readonly text: string;
}

export function describeAssigneeSuggestion(
  suggestion: AssigneeSuggestion | null,
  assigneeId: string,
): AssigneeSuggestionPresentation {
  if (suggestion === null) {
    return { status: 'hidden', text: '' };
  }

  const copy = incidentDetailCopy.dialogs.assigneeSuggestion;
  const closedCases = copy.closedCases(suggestion.closedInCategory);
  const openCases = copy.openCases(suggestion.openAssigned);

  if (suggestion.assignee.id === assigneeId) {
    return {
      status: 'applied',
      text: copy.applied(closedCases, openCases, ASSIGNEE_EXPERIENCE_WINDOW_DAYS),
    };
  }

  return {
    status: 'overridden',
    text: copy.overridden(suggestion.assignee.name, closedCases, openCases),
  };
}
