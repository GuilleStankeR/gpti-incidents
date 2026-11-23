import type { IncidentStatus } from '@incidents/shared';

import type { VisibilityScope } from './visibility';

export interface DuplicateCandidate {
  readonly id: string;
  readonly folio: string;
  readonly status: IncidentStatus;
  readonly reportedAt: Date;
  readonly reporterId: string;
}

export interface VisibleDuplicates {
  readonly duplicates: readonly DuplicateCandidate[];
  readonly hiddenCount: number;
}

export function separateVisibleDuplicates(
  candidates: readonly DuplicateCandidate[],
  scope: VisibilityScope,
): VisibleDuplicates {
  const duplicates =
    scope.reporterId === undefined
      ? candidates
      : candidates.filter((candidate) => candidate.reporterId === scope.reporterId);

  return { duplicates, hiddenCount: candidates.length - duplicates.length };
}
