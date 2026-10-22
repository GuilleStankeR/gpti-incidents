import type { ReactElement } from 'react';

import type { EvidenceItem } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { formatDateTime, formatFileSize } from '@/shared/lib/format';
import { DescriptionList } from '@/shared/ui/DescriptionList';

import { ProtectedImage } from './ProtectedImage';

interface EvidenceViewerProps {
  readonly evidence: EvidenceItem;
}

export function EvidenceViewer({ evidence }: EvidenceViewerProps): ReactElement {
  const copy = incidentDetailCopy.evidence;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex h-[55vh] items-center justify-center overflow-hidden rounded-lg bg-slate-900">
        <ProtectedImage
          url={evidence.url}
          alt={copy.imageAlt(evidence.originalName)}
          fit="contain"
        />
      </div>
      <DescriptionList
        items={[
          { label: copy.originalName, value: evidence.originalName },
          { label: copy.size, value: formatFileSize(evidence.sizeBytes) },
          { label: copy.uploadedBy, value: evidence.uploadedBy.name },
          { label: copy.uploadedAt, value: formatDateTime(evidence.createdAt) },
          {
            label: copy.sha256,
            value: (
              <div className="flex flex-col gap-1">
                <code className="rounded-md bg-slate-100 px-2 py-1.5 font-mono text-xs break-all text-slate-800">
                  {evidence.sha256}
                </code>
                <span className="text-xs text-slate-500">{copy.sha256Hint}</span>
              </div>
            ),
            isWide: true,
          },
        ]}
      />
    </div>
  );
}
