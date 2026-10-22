import { ErrorCode, OCCURRED_AT_MAX_AGE_DAYS } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';
import { isValidDate, subtractDays } from '@/common/time/date-math';

export function assertValidOccurredAt(occurredAt: Date, reportedAt: Date): void {
  const earliestAllowed = subtractDays(reportedAt, OCCURRED_AT_MAX_AGE_DAYS);
  const isWithinRange = occurredAt <= reportedAt && occurredAt >= earliestAllowed;

  if (!isValidDate(occurredAt) || !isWithinRange) {
    throw new DomainError(ErrorCode.INVALID_OCCURRED_AT);
  }
}
