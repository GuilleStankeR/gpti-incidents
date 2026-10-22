import type { ReactElement } from 'react';

import type { EvidenceItem } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';

import { EvidenceThumbnail } from './EvidenceThumbnail';

interface EvidenceGridProps {
  readonly evidence: readonly EvidenceItem[];
  readonly onOpen: (evidence: EvidenceItem) => void;
}

export function EvidenceGrid({ evidence, onOpen }: EvidenceGridProps): ReactElement {
  if (evidence.length === 0) {
    return <p className="text-sm text-slate-500">{incidentDetailCopy.evidence.empty}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {evidence.map((item) => (
        <EvidenceThumbnail key={item.id} evidence={item} onOpen={onOpen} />
      ))}
    </div>
  );
}
