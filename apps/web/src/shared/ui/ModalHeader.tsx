import type { ReactElement } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';

import { IconButton } from './IconButton';

interface ModalHeaderProps {
  readonly titleId: string;
  readonly title: string;
  readonly description?: string;
  readonly onClose: () => void;
}

export function ModalHeader({
  titleId,
  title,
  description,
  onClose,
}: ModalHeaderProps): ReactElement {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 pr-2 pl-5">
      <div className="flex flex-col gap-0.5 pt-1.5">
        <h2 id={titleId} className="text-base font-semibold text-slate-900">
          {title}
        </h2>
        {description === undefined ? null : <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <IconButton icon="close" label={commonCopy.actions.close} onClick={onClose} />
    </header>
  );
}
