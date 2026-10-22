import { useSearchParams } from 'react-router-dom';

import type { DateRangeValue } from '@/shared/ui/DateRangeFields';

const FROM_PARAM = 'from';
const TO_PARAM = 'to';

export interface MetricsRangeState {
  readonly range: DateRangeValue;
  readonly hasCustomRange: boolean;
  readonly setRange: (range: DateRangeValue) => void;
  readonly resetRange: () => void;
}

function readDate(params: URLSearchParams, key: string): string | undefined {
  const value = params.get(key);
  return value === null || value.length === 0 ? undefined : value;
}

export function useMetricsRange(): MetricsRangeState {
  const [searchParams, setSearchParams] = useSearchParams();
  const range: DateRangeValue = {
    from: readDate(searchParams, FROM_PARAM),
    to: readDate(searchParams, TO_PARAM),
  };

  return {
    range,
    hasCustomRange: range.from !== undefined || range.to !== undefined,
    setRange: (nextRange) => {
      const next = new URLSearchParams();
      if (nextRange.from !== undefined) {
        next.set(FROM_PARAM, nextRange.from);
      }
      if (nextRange.to !== undefined) {
        next.set(TO_PARAM, nextRange.to);
      }
      setSearchParams(next, { replace: true });
    },
    resetRange: () => {
      setSearchParams(new URLSearchParams(), { replace: true });
    },
  };
}
