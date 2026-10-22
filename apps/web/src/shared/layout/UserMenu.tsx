import type { ReactElement } from 'react';

import { commonCopy } from '@/shared/copy/common.copy';
import { Avatar } from '@/shared/ui/Avatar';
import { IconButton } from '@/shared/ui/IconButton';

import type { ShellUser } from './navigation.types';

interface UserMenuProps {
  readonly user: ShellUser;
  readonly onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps): ReactElement {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-3">
        <Avatar name={user.name} />
        <div className="hidden flex-col leading-tight lg:flex">
          <span className="text-sm font-medium text-slate-900">{user.name}</span>
          <span className="text-xs text-slate-500">{user.roleLabel}</span>
        </div>
      </div>
      <IconButton icon="logout" label={commonCopy.session.logout} onClick={onLogout} />
    </div>
  );
}
