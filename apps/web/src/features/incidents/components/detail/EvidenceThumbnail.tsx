import type { ReactElement } from 'react';

import type { EvidenceItem } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';

import { ProtectedImage } from './ProtectedImage';

interface EvidenceThumbnailProps {
  readonly evidence: EvidenceItem;
  readonly onOpen: (evidence: EvidenceItem) => void;
}

export function EvidenceThumbnail({ evidence, onOpen }: EvidenceThumbnailProps): ReactElement {
  return (
    <button
      type="button"
      aria-label={incidentDetailCopy.evidence.open(evidence.originalName)}
      onClick={() => {
        onOpen(evidence);
      }}
      className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ring"
    >
      <ProtectedImage
        url={evidence.url}
        alt={incidentDetailCopy.evidence.imageAlt(evidence.originalName)}
        fit="cover"
      />
      <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-slate-900/70 to-transparent px-2 pt-6 pb-1.5 text-left text-xs text-white">
        {evidence.originalName}
      </span>
    </button>
  );
}
