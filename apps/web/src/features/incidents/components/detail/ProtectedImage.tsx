import type { ReactElement } from 'react';

import { useEvidenceImage } from '@/features/incidents/hooks/use-evidence-image';
import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { classNames } from '@/shared/lib/class-names';
import { Icon } from '@/shared/ui/icons/Icon';
import { Spinner } from '@/shared/ui/Spinner';

type ImageFit = 'cover' | 'contain';

interface ProtectedImageProps {
  readonly url: string;
  readonly alt: string;
  readonly fit: ImageFit;
}

export function ProtectedImage({ url, alt, fit }: ProtectedImageProps): ReactElement {
  const imageQuery = useEvidenceImage(url);

  if (imageQuery.isPending) {
    return (
      <span className="flex size-full min-h-24 items-center justify-center bg-slate-100 text-slate-400">
        <Spinner size="sm" />
      </span>
    );
  }

  if (imageQuery.isError) {
    return (
      <span className="flex size-full min-h-24 flex-col items-center justify-center gap-1 bg-slate-100 text-xs text-slate-500">
        <Icon name="photo" />
        {incidentDetailCopy.evidence.unavailable}
      </span>
    );
  }

  return (
    <img
      src={imageQuery.data}
      alt={alt}
      className={classNames('size-full', fit === 'cover' ? 'object-cover' : 'object-contain')}
    />
  );
}
