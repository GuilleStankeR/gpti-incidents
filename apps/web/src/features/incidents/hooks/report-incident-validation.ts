import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  OCCURRED_AT_MAX_AGE_DAYS,
} from '@incidents/shared';

import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { fromDateTimeLocalValue } from '@/shared/lib/datetime-local';

const MILLISECONDS_PER_DAY = 86_400_000;

export interface ReportIncidentValues {
  readonly categoryCode: string;
  readonly description: string;
  readonly location: string;
  readonly occurredAt: string;
}

export type ReportIncidentErrors = Partial<Record<keyof ReportIncidentValues, string>>;

const { errors } = reportIncidentCopy;

function validateOccurredAt(value: string, now: Date): string | undefined {
  if (value.length === 0) {
    return errors.occurredAtRequired;
  }

  const occurredAt = fromDateTimeLocalValue(value);

  if (occurredAt.getTime() > now.getTime()) {
    return errors.occurredAtFuture;
  }

  const ageInDays = (now.getTime() - occurredAt.getTime()) / MILLISECONDS_PER_DAY;
  return ageInDays > OCCURRED_AT_MAX_AGE_DAYS
    ? errors.occurredAtTooOld(OCCURRED_AT_MAX_AGE_DAYS)
    : undefined;
}

function validateDescription(value: string): string | undefined {
  const length = value.trim().length;
  const isWithinRange = length >= DESCRIPTION_MIN_LENGTH && length <= DESCRIPTION_MAX_LENGTH;
  return isWithinRange
    ? undefined
    : errors.descriptionLength(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH);
}

const REPORT_FIELDS: readonly (keyof ReportIncidentValues)[] = [
  'categoryCode',
  'description',
  'location',
  'occurredAt',
];

export function validateReportIncident(
  values: ReportIncidentValues,
  now: Date,
): ReportIncidentErrors {
  const candidates: Readonly<Record<keyof ReportIncidentValues, string | undefined>> = {
    categoryCode: values.categoryCode.length === 0 ? errors.categoryRequired : undefined,
    description: validateDescription(values.description),
    location: values.location.length === 0 ? errors.locationRequired : undefined,
    occurredAt: validateOccurredAt(values.occurredAt, now),
  };
  const collected: Partial<Record<keyof ReportIncidentValues, string>> = {};

  for (const field of REPORT_FIELDS) {
    const message = candidates[field];
    if (message !== undefined) {
      collected[field] = message;
    }
  }

  return collected;
}

export function hasErrors(validationErrors: ReportIncidentErrors): boolean {
  return Object.keys(validationErrors).length > 0;
}
