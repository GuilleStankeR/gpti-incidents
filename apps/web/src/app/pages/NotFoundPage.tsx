import type { ReactElement } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { EmptyState } from '@/shared/ui/EmptyState';

export function NotFoundPage(): ReactElement {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
      <div className="w-full">
        <EmptyState
          title={commonCopy.notFound.title}
          description={commonCopy.notFound.description}
          action={<ButtonLink to={ROUTE_PATHS.home}>{commonCopy.notFound.backHome}</ButtonLink>}
        />
      </div>
    </main>
  );
}
