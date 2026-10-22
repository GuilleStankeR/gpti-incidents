import { useId, useRef } from 'react';
import type { ReactElement } from 'react';

import type { UploadLimits } from '@incidents/shared';

import { formatMegabytes } from '@/features/incidents/hooks/photo-selection-rules';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { classNames } from '@/shared/lib/class-names';
import { Icon } from '@/shared/ui/icons/Icon';

interface PhotoDropzoneProps {
  readonly limits: UploadLimits;
  readonly isDisabled: boolean;
  readonly onSelect: (files: readonly File[]) => void;
}

export function PhotoDropzone({ limits, isDisabled, onSelect }: PhotoDropzoneProps): ReactElement {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const copy = reportIncidentCopy.photos;

  return (
    <label
      htmlFor={inputId}
      className={classNames(
        'flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-5 text-center focus-within:outline-2 focus-within:outline-accent-ring',
        isDisabled
          ? 'cursor-not-allowed border-slate-200 text-slate-400'
          : 'cursor-pointer border-slate-300 text-slate-600 hover:border-accent-ring hover:bg-accent-muted',
      )}
    >
      <Icon name="camera" size="lg" />
      <span className="text-sm font-medium">{copy.add}</span>
      <span className="text-xs text-slate-500">
        {copy.requirements(formatMegabytes(limits.maxFileSizeBytes))}
      </span>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={limits.acceptedMimeTypes.join(',')}
        multiple
        disabled={isDisabled}
        className="sr-only"
        onChange={(event) => {
          onSelect([...(event.target.files ?? [])]);
          if (inputRef.current !== null) {
            inputRef.current.value = '';
          }
        }}
      />
    </label>
  );
}
