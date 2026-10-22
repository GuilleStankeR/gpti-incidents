import type { ReactElement } from 'react';

import { metricsCopy } from '@/features/metrics/metrics.copy';
import { classNames } from '@/shared/lib/class-names';
import { formatInteger } from '@/shared/lib/format';

export interface BarChartItem {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly barClassName: string;
}

interface HorizontalBarChartProps {
  readonly items: readonly BarChartItem[];
}

const FULL_WIDTH_PERCENT = 100;
const BAR_RADIUS = 4;

export function HorizontalBarChart({ items }: HorizontalBarChartProps): ReactElement {
  const maximum = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.key} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-slate-700">{item.label}</span>
            <span
              className="font-medium text-slate-900 tabular-nums"
              title={metricsCopy.breakdowns.countLabel(item.value)}
            >
              {formatInteger(item.value)}
            </span>
          </div>
          <svg className="h-2.5 w-full" aria-hidden="true">
            <rect width="100%" height="100%" rx={BAR_RADIUS} className="fill-slate-100" />
            <rect
              width={`${String((item.value / maximum) * FULL_WIDTH_PERCENT)}%`}
              height="100%"
              rx={BAR_RADIUS}
              className={classNames(item.barClassName)}
            />
          </svg>
        </li>
      ))}
    </ul>
  );
}
