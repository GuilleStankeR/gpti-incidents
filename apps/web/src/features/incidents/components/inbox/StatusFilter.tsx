import type { ReactElement } from 'react';

import { INCIDENT_STATUSES } from '@incidents/shared';
import type { IncidentStatus } from '@incidents/shared';

import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { statusLabels } from '@/shared/copy/domain-labels.copy';
import { SelectField } from '@/shared/ui/SelectField';

interface StatusFilterProps {
  readonly value: IncidentStatus | undefined;
  readonly onChange: (status: string) => void;
}

const STATUS_OPTIONS = INCIDENT_STATUSES.map((status) => ({
  value: status,
  label: statusLabels[status],
}));

export function StatusFilter({ value, onChange }: StatusFilterProps): ReactElement {
  return (
    <SelectField
      label={incidentsCopy.filters.statusLabel}
      placeholder={incidentsCopy.filters.allOption}
      options={STATUS_OPTIONS}
      value={value ?? ''}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
