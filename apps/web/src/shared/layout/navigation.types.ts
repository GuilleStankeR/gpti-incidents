import type { IconName } from '@/shared/ui/icons/icon-paths';

export interface NavigationItem {
  readonly to: string;
  readonly label: string;
  readonly icon: IconName;
  readonly isExactMatch?: boolean;
}

export interface ShellUser {
  readonly name: string;
  readonly roleLabel: string;
}

export interface ShellBrand {
  readonly title: string;
  readonly subtitle: string;
}
