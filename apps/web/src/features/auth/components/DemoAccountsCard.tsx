import type { ReactElement } from 'react';

import { authCopy } from '@/features/auth/auth.copy';
import type { DemoAccount } from '@/features/auth/auth.copy';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';

interface DemoAccountsCardProps {
  readonly onSelect: (account: DemoAccount) => void;
}

export function DemoAccountsCard({ onSelect }: DemoAccountsCardProps): ReactElement {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-slate-400">
          <Icon name="info" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-slate-800">{authCopy.demo.title}</h2>
          <p className="text-sm text-slate-500">{authCopy.demo.description}</p>
        </div>
      </div>
      <ul className="mt-3 divide-y divide-slate-200">
        {authCopy.demo.accounts.map((account) => (
          <li key={account.email} className="flex items-center justify-between gap-3 py-2">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                {account.roleLabel}
              </span>
              <span className="truncate text-sm text-slate-900">{account.email}</span>
            </div>
            <Button
              variant="secondary"
              aria-label={authCopy.demo.useAccountLabel(account.email)}
              onClick={() => {
                onSelect(account);
              }}
            >
              {authCopy.demo.useAccount}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
