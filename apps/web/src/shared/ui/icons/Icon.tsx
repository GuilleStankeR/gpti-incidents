import type { ReactElement } from 'react';

import { classNames } from '@/shared/lib/class-names';

import { ICON_PATHS } from './icon-paths';
import type { IconName } from './icon-paths';

type IconSize = 'sm' | 'md' | 'lg';

interface IconProps {
  readonly name: IconName;
  readonly size?: IconSize;
}

const SIZE_CLASSES: Readonly<Record<IconSize, string>> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

export function Icon({ name, size = 'md' }: IconProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden="true"
      className={classNames('shrink-0', SIZE_CLASSES[size])}
    >
      {ICON_PATHS[name].map((path) => (
        <path key={path} strokeLinecap="round" strokeLinejoin="round" d={path} />
      ))}
    </svg>
  );
}
