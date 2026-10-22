import type { ReactElement } from 'react';

import type { MetricsResponse } from '@incidents/shared';

import { metricsCopy } from '@/features/metrics/metrics.copy';
import { Card } from '@/shared/ui/Card';

import { HorizontalBarChart } from './HorizontalBarChart';

interface CategoryBreakdownProps {
  readonly metrics: MetricsResponse;
}

export function CategoryBreakdown({ metrics }: CategoryBreakdownProps): ReactElement {
  return (
    <Card title={metricsCopy.breakdowns.byCategory}>
      <HorizontalBarChart
        items={metrics.byCategory.map((category) => ({
          key: category.code,
          label: category.name,
          value: category.count,
          barClassName: 'fill-accent',
        }))}
      />
    </Card>
  );
}
