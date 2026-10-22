import type { ReactElement } from 'react';

import { useAssignableUsers } from '@/features/incidents/hooks/use-assignable-users';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { roleLabels } from '@/shared/copy/domain-labels.copy';
import { SelectField } from '@/shared/ui/SelectField';

interface AssigneeSelectProps {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (assigneeId: string) => void;
}

export function AssigneeSelect({ value, error, onChange }: AssigneeSelectProps): ReactElement {
  const users = useAssignableUsers().data ?? [];

  return (
    <SelectField
      label={incidentDetailCopy.dialogs.assignee}
      placeholder={incidentDetailCopy.dialogs.assigneePlaceholder}
      options={users.map((user) => ({
        value: user.id,
        label: incidentDetailCopy.dialogs.assigneeOption(user.name, roleLabels[user.role]),
      }))}
      value={value}
      error={error}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
