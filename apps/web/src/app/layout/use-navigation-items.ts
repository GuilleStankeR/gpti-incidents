import { Capability } from '@incidents/shared';

import { useCapability } from '@/features/auth/hooks/use-auth';
import { commonCopy } from '@/shared/copy/common.copy';
import type { NavigationItem } from '@/shared/layout/navigation.types';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';

const BASE_ITEMS: readonly NavigationItem[] = [
  {
    to: ROUTE_PATHS.incidents,
    label: commonCopy.navigation.inbox,
    icon: 'inbox',
    isExactMatch: true,
  },
  { to: ROUTE_PATHS.newIncident, label: commonCopy.navigation.report, icon: 'plus' },
];

const METRICS_ITEM: NavigationItem = {
  to: ROUTE_PATHS.metrics,
  label: commonCopy.navigation.metrics,
  icon: 'chart',
};

export function useNavigationItems(): readonly NavigationItem[] {
  const canViewMetrics = useCapability(Capability.VIEW_METRICS);
  return canViewMetrics ? [...BASE_ITEMS, METRICS_ITEM] : BASE_ITEMS;
}
