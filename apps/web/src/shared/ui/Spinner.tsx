import type { ReactElement } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';
import { classNames } from '@/shared/lib/class-names';

type SpinnerSize = 'sm' | 'md';

interface SpinnerProps {
  readonly size?: SpinnerSize;
}

const SIZE_CLASSES: Readonly<Record<SpinnerSize, string>> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
};

export function Spinner({ size = 'md' }: SpinnerProps): ReactElement {
  return (
    <span
      role="status"
      aria-label={commonCopy.states.loading}
      className={classNames(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        SIZE_CLASSES[size],
      )}
    />
  );
}
