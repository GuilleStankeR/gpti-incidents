import type { ReactElement } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';

import { Button } from './Button';
import { Icon } from './icons/Icon';

interface PaginationProps {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps): ReactElement {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={commonCopy.pagination.label}
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-slate-600">
        {commonCopy.pagination.summary(firstItem, lastItem, total)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => {
            onPageChange(page - 1);
          }}
        >
          <Icon name="chevronLeft" size="sm" />
          {commonCopy.pagination.previous}
        </Button>
        <span className="px-2 text-sm text-slate-600">
          {commonCopy.pagination.pageOf(page, pageCount)}
        </span>
        <Button
          variant="secondary"
          disabled={page >= pageCount}
          onClick={() => {
            onPageChange(page + 1);
          }}
        >
          {commonCopy.pagination.next}
          <Icon name="chevronRight" size="sm" />
        </Button>
      </div>
    </nav>
  );
}
