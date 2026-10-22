import type { ReactElement } from 'react';

import type { SelectedPhoto } from '@/features/incidents/hooks/use-photo-selection';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { Icon } from '@/shared/ui/icons/Icon';

interface PhotoPreviewGridProps {
  readonly photos: readonly SelectedPhoto[];
  readonly onRemove: (photoId: string) => void;
}

export function PhotoPreviewGrid({ photos, onRemove }: PhotoPreviewGridProps): ReactElement {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {photos.map((photo, index) => (
        <li
          key={photo.id}
          className="relative aspect-square overflow-hidden rounded-lg bg-slate-100"
        >
          <img
            src={photo.previewUrl}
            alt={reportIncidentCopy.photos.previewAlt(index + 1)}
            className="size-full object-cover"
          />
          <button
            type="button"
            aria-label={reportIncidentCopy.photos.remove(index + 1)}
            onClick={() => {
              onRemove(photo.id);
            }}
            className="absolute top-1 right-1 flex size-11 items-center justify-center rounded-full text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-slate-900/70">
              <Icon name="close" size="sm" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
