const MILLISECONDS_PER_MINUTE = 60_000;
const DATETIME_LOCAL_LENGTH = 16;

export function toDateTimeLocalValue(date: Date): string {
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * MILLISECONDS_PER_MINUTE);
  return localTime.toISOString().slice(0, DATETIME_LOCAL_LENGTH);
}

export function fromDateTimeLocalValue(value: string): Date {
  return new Date(value);
}
