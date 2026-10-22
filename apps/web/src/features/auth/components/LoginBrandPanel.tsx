import type { ReactElement } from 'react';

import { authCopy } from '@/features/auth/auth.copy';
import { commonCopy } from '@/shared/copy/common.copy';
import { Icon } from '@/shared/ui/icons/Icon';

export function LoginBrandPanel(): ReactElement {
  return (
    <aside className="relative hidden overflow-hidden bg-accent px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
      <div
        className="absolute -top-24 -right-24 size-96 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-16 size-80 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
          <Icon name="building" />
        </span>
        <div className="flex flex-col">
          <span className="font-semibold">{commonCopy.appName}</span>
          <span className="text-sm text-blue-200">{authCopy.brand.eyebrow}</span>
        </div>
      </div>
      <div className="relative flex max-w-md flex-col gap-6">
        <h2 className="text-3xl font-semibold tracking-tight">{authCopy.brand.headline}</h2>
        <p className="text-base text-blue-100">{authCopy.brand.description}</p>
        <ul className="flex flex-col gap-3">
          {authCopy.brand.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 text-sm text-blue-50">
              <span className="mt-0.5 text-blue-300">
                <Icon name="checkCircle" />
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
      <p className="relative text-xs text-blue-200">{commonCopy.appTagline}</p>
    </aside>
  );
}
