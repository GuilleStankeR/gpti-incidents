import type { ReactElement } from 'react';

import { Icon } from './icons/Icon';
import type { IconName } from './icons/icon-paths';

interface IconButtonProps {
  readonly icon: IconName;
  readonly label: string;
  readonly onClick: () => void;
}

export function IconButton({ icon, label, onClick }: IconButtonProps): ReactElement {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ring"
    >
      <Icon name={icon} />
    </button>
  );
}
