import type { ReactElement } from 'react';

import type { AssigneeSuggestion } from '@incidents/shared';

import { useAssignableUsers } from '@/features/incidents/hooks/use-assignable-users';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { roleLabels } from '@/shared/copy/domain-labels.copy';
import { SelectField } from '@/shared/ui/SelectField';

import { AssigneeSuggestionHint } from './AssigneeSuggestionHint';

interface AssigneeSelectProps {
  readonly value: string;
  readonly error?: string;
  readonly suggestion: AssigneeSuggestion | null;
  readonly onChange: (assigneeId: string) => void;
}

export function AssigneeSelect({
  value,
  error,
  suggestion,
  onChange,
}: AssigneeSelectProps): ReactElement {
  const usersQuery = useAssignableUsers();
  const users = usersQuery.data ?? [];
  const copy = incidentDetailCopy.dialogs;

  return (
    <div className="flex flex-col gap-2">
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
      <AssigneeSuggestionHint suggestion={suggestion} assigneeId={value} onApply={onChange} />
    </div>
  );
}
