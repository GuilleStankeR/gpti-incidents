import type { AssigneeSuggestionResponse } from '@incidents/shared';

import { toUserSummary } from '@/modules/users/users.mapper';

import type { AssigneeCandidate } from './domain/assignee-suggestion';

export function toAssigneeSuggestionResponse(
  candidate: AssigneeCandidate | null,
): AssigneeSuggestionResponse {
  if (candidate === null) {
    return { suggestion: null };
  }

  return {
    suggestion: {
      assignee: toUserSummary(candidate),
      closedInCategory: candidate.closedInCategory,
      openAssigned: candidate.openAssigned,
    },
  };
}
