import type { ReactElement } from 'react';

import { getInitials } from '@/shared/lib/initials';

interface AvatarProps {
  readonly name: string;
}

export function Avatar({ name }: AvatarProps): ReactElement {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
    >
      {getInitials(name)}
    </span>
  );
}
