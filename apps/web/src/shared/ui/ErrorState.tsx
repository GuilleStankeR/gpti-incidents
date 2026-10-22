import type { ReactElement } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';

import { Button } from './Button';

interface ErrorStateProps {
  readonly message: string;
  readonly onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): ReactElement {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center"
    >
      <p className="font-medium text-red-900">{commonCopy.states.errorTitle}</p>
      <p className="text-sm text-red-800">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        {commonCopy.states.retry}
      </Button>
    </div>
  );
}
