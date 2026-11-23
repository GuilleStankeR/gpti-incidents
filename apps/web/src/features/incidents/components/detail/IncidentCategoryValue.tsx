import type { ReactElement } from 'react';

import type { IncidentDetail } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { Badge } from '@/shared/ui/Badge';
import { Icon } from '@/shared/ui/icons/Icon';

interface IncidentCategoryValueProps {
  readonly incident: IncidentDetail;
}

export function IncidentCategoryValue({ incident }: IncidentCategoryValueProps): ReactElement {
  const copy = incidentDetailCopy.info;
  const { category, suggestedCategory } = incident;
  const wasSuggestionAccepted = suggestedCategory?.code === category.code;
  const wasSuggestionChanged = suggestedCategory !== null && !wasSuggestionAccepted;

  return (
    <span className="flex flex-col items-start gap-1.5">
      <span>{category.name}</span>
      {wasSuggestionAccepted ? (
        <Badge tone="indigo">
          <span className="flex items-center gap-1">
            <Icon name="sparkles" size="sm" />
            {copy.suggestedCategory}
          </span>
        </Badge>
      ) : null}
      {wasSuggestionChanged ? (
        <span className="text-xs text-slate-500">
          {copy.differentSuggestion(suggestedCategory.name)}
        </span>
      ) : null}
    </span>
  );
}
