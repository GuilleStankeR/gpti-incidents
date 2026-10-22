import type { ReactElement } from 'react';

import type { IncidentDetail } from '@incidents/shared';

import { useCreatedFolio } from '@/features/incidents/hooks/use-created-folio';

import { AuditTimelineCard } from './AuditTimelineCard';
import { CreatedFolioNotice } from './CreatedFolioNotice';
import { EvidenceGalleryCard } from './EvidenceGalleryCard';
import { IncidentActionsCard } from './IncidentActionsCard';
import { IncidentDetailHeader } from './IncidentDetailHeader';
import { IncidentInfoCard } from './IncidentInfoCard';
import { LocationCard } from './LocationCard';

interface IncidentDetailViewProps {
  readonly incident: IncidentDetail;
}

export function IncidentDetailView({ incident }: IncidentDetailViewProps): ReactElement {
  const createdFolio = useCreatedFolio();

  return (
    <div className="flex flex-col gap-6">
      {createdFolio === null ? null : <CreatedFolioNotice folio={createdFolio} />}
      <IncidentDetailHeader incident={incident} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:order-2">
          <IncidentActionsCard incident={incident} />
        </aside>
        <div className="flex flex-col gap-6 lg:order-1">
          <IncidentInfoCard incident={incident} />
          <LocationCard incident={incident} />
          <EvidenceGalleryCard incident={incident} />
          <AuditTimelineCard entries={incident.auditTrail} />
        </div>
      </div>
    </div>
  );
}
