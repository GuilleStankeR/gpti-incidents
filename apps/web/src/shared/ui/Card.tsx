import type { ReactElement, ReactNode } from 'react';

interface CardProps {
  readonly children: ReactNode;
}

export function Card({ children }: CardProps): ReactElement {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs md:p-6">
      {children}
    </section>
  );
}
