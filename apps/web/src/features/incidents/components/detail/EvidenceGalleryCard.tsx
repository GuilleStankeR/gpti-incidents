import { useState } from 'react';
import type { ReactElement } from 'react';

import { isTerminalStatus } from '@incidents/shared';
import type { EvidenceItem, IncidentDetail } from '@incidents/shared';

import { useCatalogs } from '@/features/incidents/hooks/use-catalogs';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { Card } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';

import { AttachEvidencePanel } from './AttachEvidencePanel';
import { EvidenceGrid } from './EvidenceGrid';
import { EvidenceViewer } from './EvidenceViewer';

interface EvidenceGalleryCardProps {
  readonly incident: IncidentDetail;
}

export function EvidenceGalleryCard({ incident }: EvidenceGalleryCardProps): ReactElement {
  const [selected, setSelected] = useState<EvidenceItem | null>(null);
  const [attachKey, setAttachKey] = useState(0);
  const limits = useCatalogs().data?.uploadLimits;
  const copy = incidentDetailCopy.evidence;

  return (
    <Card title={copy.title} description={copy.count(incident.evidence.length)}>
      <div className="flex flex-col gap-4">
        <EvidenceGrid evidence={incident.evidence} onOpen={setSelected} />
        {limits !== undefined && !isTerminalStatus(incident.status) ? (
          <AttachEvidencePanel
            key={attachKey}
            incidentId={incident.id}
            limits={limits}
            onAttached={() => {
              setAttachKey((key) => key + 1);
            }}
          />
        ) : null}
      </div>
      <Modal
        isOpen={selected !== null}
        title={copy.viewerTitle}
        description={selected?.originalName}
        size="lg"
        onClose={() => {
          setSelected(null);
        }}
      >
        {selected === null ? null : <EvidenceViewer evidence={selected} />}
      </Modal>
    </Card>
  );
}
