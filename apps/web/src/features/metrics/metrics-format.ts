import { commonCopy } from '@/shared/copy/common.copy';
import { formatDecimal } from '@/shared/lib/format';

import { metricsCopy } from './metrics.copy';

export function formatHours(value: number | null): string {
  return value === null ? commonCopy.emptyValue : metricsCopy.hours(formatDecimal(value));
}

export function formatPercentage(value: number | null): string {
  return value === null ? commonCopy.emptyValue : metricsCopy.percentage(formatDecimal(value));
}
