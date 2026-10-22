import { classNames } from '@/shared/lib/class-names';

const CONTROL_BASE_CLASSES =
  'block w-full min-h-11 rounded-lg border bg-white px-3 text-base text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:text-sm';

export function controlClassNames(hasError: boolean): string {
  return classNames(
    CONTROL_BASE_CLASSES,
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-accent-ring focus:ring-accent-soft',
  );
}

export function describedByIds(fieldId: string, hasDescription: boolean): string | undefined {
  return hasDescription ? `${fieldId}-description` : undefined;
}
