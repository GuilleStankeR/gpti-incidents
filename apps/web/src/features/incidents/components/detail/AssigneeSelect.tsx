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
  const usersQuery = useAssignableUsers();
  const users = usersQuery.data ?? [];
  const copy = incidentDetailCopy.dialogs;

  return (
    <SelectField
      label={copy.assignee}
      placeholder={usersQuery.isPending ? copy.assigneeLoading : copy.assigneePlaceholder}
      disabled={usersQuery.isPending}
      options={users.map((user) => ({
        value: user.id,
        label: copy.assigneeOption(user.name, roleLabels[user.role]),
      }))}
      value={value}
      error={error}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
