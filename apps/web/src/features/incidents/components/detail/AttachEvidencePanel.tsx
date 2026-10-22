import type { ReactElement } from 'react';

import type { UploadLimits } from '@incidents/shared';

import { PhotoPicker } from '@/features/incidents/components/report/PhotoPicker';
import { useAttachEvidence } from '@/features/incidents/hooks/use-incident-mutations';
import { usePhotoSelection } from '@/features/incidents/hooks/use-photo-selection';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { getErrorMessage } from '@/shared/api/error-message';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';
import { InlineAlert } from '@/shared/ui/InlineAlert';

interface AttachEvidencePanelProps {
  readonly incidentId: string;
  readonly limits: UploadLimits;
  readonly onAttached: () => void;
}

export function AttachEvidencePanel({
  incidentId,
  limits,
  onAttached,
}: AttachEvidencePanelProps): ReactElement {
  const selection = usePhotoSelection(limits);
  const mutation = useAttachEvidence(incidentId);
  const copy = incidentDetailCopy.evidence;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
      <h3 className="text-sm font-semibold text-slate-900">{copy.attachTitle}</h3>
      <PhotoPicker selection={selection} />
      {mutation.isError ? (
        <InlineAlert tone="error" title={copy.attachErrorTitle}>
          {getErrorMessage(mutation.error)}
        </InlineAlert>
      ) : null}
      {selection.photos.length > 0 ? (
        <div className="flex justify-end">
          <Button
            isLoading={mutation.isPending}
            onClick={() => {
              mutation.mutate(
                selection.photos.map((photo) => photo.file),
                { onSuccess: onAttached },
              );
            }}
          >
            <Icon name="upload" size="sm" />
            {copy.attachSubmit(selection.photos.length)}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
