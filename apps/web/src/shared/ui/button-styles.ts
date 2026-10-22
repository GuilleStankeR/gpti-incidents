import { classNames } from '@/shared/lib/class-names';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const BASE_CLASSES =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANT_CLASSES: Readonly<Record<ButtonVariant, string>> = {
  primary: 'bg-accent text-white hover:bg-accent-hover focus-visible:outline-accent-ring',
  secondary:
    'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline-accent-ring',
  danger: 'bg-red-700 text-white hover:bg-red-800 focus-visible:outline-red-700',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:outline-accent-ring',
};

export function buttonClassNames(variant: ButtonVariant, isFullWidth: boolean): string {
  return classNames(BASE_CLASSES, VARIANT_CLASSES[variant], isFullWidth && 'w-full');
}
