import type { PossibleDuplicatesResponse } from '@incidents/shared';

import type { VisibleDuplicates } from './domain/possible-duplicates';

export function toPossibleDuplicatesResponse(
  result: VisibleDuplicates,
): PossibleDuplicatesResponse {
  return {
    duplicates: result.duplicates.map((duplicate) => ({
      id: duplicate.id,
      folio: duplicate.folio,
      status: duplicate.status,
      reportedAt: duplicate.reportedAt.toISOString(),
    })),
    hiddenCount: result.hiddenCount,
  };
}
