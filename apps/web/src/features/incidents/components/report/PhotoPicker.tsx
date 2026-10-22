import type { ReactElement } from 'react';

import type { PhotoSelectionState } from '@/features/incidents/hooks/use-photo-selection';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { InlineAlert } from '@/shared/ui/InlineAlert';

import { PhotoDropzone } from './PhotoDropzone';
import { PhotoPreviewGrid } from './PhotoPreviewGrid';

interface PhotoPickerProps {
  readonly selection: PhotoSelectionState;
}

export function PhotoPicker({ selection }: PhotoPickerProps): ReactElement {
  const { photos, limits } = selection;
  const copy = reportIncidentCopy.photos;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-800">{copy.label}</span>
        <span className="text-xs text-slate-500 tabular-nums">
          {copy.counter(photos.length, limits.maxFiles)}
        </span>
      </div>
      <PhotoDropzone
        limits={limits}
        isDisabled={photos.length >= limits.maxFiles}
        onSelect={selection.add}
      />
      {selection.error === null ? null : (
        <InlineAlert tone="warning">{selection.error}</InlineAlert>
      )}
      {photos.length > 0 ? <PhotoPreviewGrid photos={photos} onRemove={selection.remove} /> : null}
    </div>
  );
}
