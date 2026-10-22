export const DISPLAY_LOCALE = 'es-CL';

const DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
};

export function formatDateTime(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    ...DATE_TIME_FORMAT_OPTIONS,
    timeZone,
  }).formatToParts(date);

  const partValue = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${partValue('day')}-${partValue('month')}-${partValue('year')} ${partValue('hour')}:${partValue('minute')}`;
}
