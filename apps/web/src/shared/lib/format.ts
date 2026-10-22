import { DISPLAY_LOCALE, formatDateTime as formatSharedDateTime } from '@incidents/shared';

import { commonCopy } from '@/shared/copy/common.copy';

const DISPLAY_TIME_ZONE = import.meta.env.TIME_ZONE;
const ONE_DECIMAL = 1;
const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;

const decimalFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: ONE_DECIMAL,
});

const integerFormatter = new Intl.NumberFormat(DISPLAY_LOCALE);

const dateFormatter = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: DISPLAY_TIME_ZONE,
});

export function formatDateTime(isoDate: string): string {
  return formatSharedDateTime(new Date(isoDate), DISPLAY_TIME_ZONE);
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function formatDecimal(value: number): string {
  return decimalFormatter.format(value);
}

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatFileSize(bytes: number): string {
  if (bytes >= BYTES_PER_MEGABYTE) {
    return commonCopy.fileSize(formatDecimal(bytes / BYTES_PER_MEGABYTE), 'MB');
  }

  return commonCopy.fileSize(formatDecimal(bytes / BYTES_PER_KILOBYTE), 'KB');
}
