import type { ReactElement } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';

import { Spinner } from './Spinner';

interface LoadingStateProps {
  readonly message?: string;
}

export function LoadingState({
  message = commonCopy.states.loading,
}: LoadingStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
      <Spinner />
      <p className="text-sm">{message}</p>
    </div>
  );
}
