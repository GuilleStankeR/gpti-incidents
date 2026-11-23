import { ASSIGNEE_EXPERIENCE_WEIGHT } from './domain.constants';

export interface AssigneeCandidate {
  readonly id: string;
  readonly name: string;
  readonly closedInCategory: number;
  readonly openAssigned: number;
}

function scoreCandidate(candidate: AssigneeCandidate): number {
  return candidate.closedInCategory * ASSIGNEE_EXPERIENCE_WEIGHT - candidate.openAssigned;
}

function compareCandidates(first: AssigneeCandidate, second: AssigneeCandidate): number {
  const scoreDifference = scoreCandidate(second) - scoreCandidate(first);

  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  const workloadDifference = first.openAssigned - second.openAssigned;
  return workloadDifference === 0 ? first.name.localeCompare(second.name) : workloadDifference;
}

export function pickSuggestedAssignee(
  candidates: readonly AssigneeCandidate[],
  excludedAssigneeId: string | null,
): AssigneeCandidate | null {
  const [best] = candidates
    .filter((candidate) => candidate.id !== excludedAssigneeId)
    .toSorted(compareCandidates);

  return best ?? null;
}
