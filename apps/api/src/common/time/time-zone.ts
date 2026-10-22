const MILLISECONDS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const UTC_OFFSET_PATTERN = /GMT([+-])(\d{2}):(\d{2})/;
const NEGATIVE_SIGN = '-';

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const offsetLabel =
    new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value ?? '';
  const [, sign, hours, minutes] = UTC_OFFSET_PATTERN.exec(offsetLabel) ?? [];

  if (sign === undefined || hours === undefined || minutes === undefined) {
    return 0;
  }

  const offsetMinutes = Number(hours) * MINUTES_PER_HOUR + Number(minutes);
  return sign === NEGATIVE_SIGN ? -offsetMinutes : offsetMinutes;
}

export function startOfDayInTimeZone(isoDate: string, timeZone: string): Date {
  const utcMidnight = new Date(`${isoDate}T00:00:00Z`);
  const offsetMinutes = getTimeZoneOffsetMinutes(utcMidnight, timeZone);
  return new Date(utcMidnight.getTime() - offsetMinutes * MILLISECONDS_PER_MINUTE);
}
