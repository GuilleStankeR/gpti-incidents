import type { ReactElement } from 'react';

import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';

interface ClearFiltersFooterProps {
  readonly onClear: () => void;
}

export function ClearFiltersFooter({ onClear }: ClearFiltersFooterProps): ReactElement {
  return (
    <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
      <Button variant="ghost" onClick={onClear}>
        <Icon name="close" size="sm" />
        {incidentsCopy.filters.clear}
      </Button>
    </div>
  );
}
