import { addHours } from './date-math';
import { startOfDayInTimeZone } from './time-zone';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const HOURS_PER_DAY = 24;
const ONE_MILLISECOND = 1;

export interface DateRangeInput {
  readonly from?: string;
  readonly to?: string;
}

export interface DateRange {
  readonly from?: Date;
  readonly to?: Date;
}

function isDateOnly(value: string): boolean {
  return DATE_ONLY_PATTERN.test(value);
}

function resolveRangeStart(value: string, timeZone: string): Date {
  return isDateOnly(value) ? startOfDayInTimeZone(value, timeZone) : new Date(value);
}

function resolveRangeEnd(value: string, timeZone: string): Date {
  if (!isDateOnly(value)) {
    return new Date(value);
  }

  const nextDayStart = addHours(startOfDayInTimeZone(value, timeZone), HOURS_PER_DAY);
  return new Date(nextDayStart.getTime() - ONE_MILLISECOND);
}

export function resolveDateRange(input: DateRangeInput, timeZone: string): DateRange {
  return {
    from: input.from === undefined ? undefined : resolveRangeStart(input.from, timeZone),
    to: input.to === undefined ? undefined : resolveRangeEnd(input.to, timeZone),
  };
}
