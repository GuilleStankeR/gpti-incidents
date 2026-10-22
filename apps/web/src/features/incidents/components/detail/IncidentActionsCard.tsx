import { useState } from 'react';
import type { ReactElement } from 'react';

import { Capability, isReassignableStatus } from '@incidents/shared';
import type { IncidentDetail, IncidentStatus } from '@incidents/shared';

import { useCapability } from '@/features/auth/hooks/use-auth';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { Card } from '@/shared/ui/Card';

import { CaseFileDownloadButton } from './CaseFileDownloadButton';
import { IncidentActionDialogs } from './IncidentActionDialogs';
import type { ActiveDialog } from './IncidentActionDialogs';
import { TransitionButtons } from './TransitionButtons';

interface IncidentActionsCardProps {
  readonly incident: IncidentDetail;
}

export function IncidentActionsCard({ incident }: IncidentActionsCardProps): ReactElement {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const canReassign =
    useCapability(Capability.MANAGE_ASSIGNMENTS) && isReassignableStatus(incident.status);
  const canDownload = useCapability(Capability.DOWNLOAD_CASE_FILE);
  const hasTransitions = incident.availableTransitions.length > 0;

  return (
    <Card title={incidentDetailCopy.actions.title}>
      <div className="flex flex-col gap-3">
        <TransitionButtons
          transitions={incident.availableTransitions}
          canReassign={canReassign}
          onTransition={(target: IncidentStatus) => {
            setActiveDialog({ kind: 'transition', target });
          }}
          onReassign={() => {
            setActiveDialog({ kind: 'reassign' });
          }}
        />
        {!hasTransitions && !canReassign ? (
          <p className="text-sm text-slate-500">{incidentDetailCopy.actions.none}</p>
        ) : null}
        {canDownload ? <CaseFileDownloadButton incident={incident} /> : null}
      </div>
      <IncidentActionDialogs
        incident={incident}
        activeDialog={activeDialog}
        onClose={() => {
          setActiveDialog(null);
        }}
      />
    </Card>
  );
}
