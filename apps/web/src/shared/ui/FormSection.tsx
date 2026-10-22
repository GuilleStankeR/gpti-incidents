import type { ReactElement, ReactNode } from 'react';

interface FormSectionProps {
  readonly step: number;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}

export function FormSection({
  step,
  title,
  description,
  children,
}: FormSectionProps): ReactElement {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
      <header className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          {step}
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {description === undefined ? null : (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </header>
      <div className="flex flex-col gap-4 p-4 sm:p-5">{children}</div>
    </section>
  );
}
