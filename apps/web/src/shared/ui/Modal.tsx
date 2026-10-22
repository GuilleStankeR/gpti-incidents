import { useId, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useModalBehavior } from '@/shared/hooks/use-modal-behavior';
import { classNames } from '@/shared/lib/class-names';

import { ModalHeader } from './ModalHeader';

type ModalSize = 'md' | 'lg';

interface ModalProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description?: string;
  readonly size?: ModalSize;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

const SIZE_CLASSES: Readonly<Record<ModalSize, string>> = {
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-3xl',
};

export function Modal({
  isOpen,
  title,
  description,
  size = 'md',
  onClose,
  children,
}: ModalProps): ReactElement | null {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useModalBehavior(isOpen, onClose, panelRef);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={classNames(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl focus:outline-none sm:rounded-2xl',
          SIZE_CLASSES[size],
        )}
      >
        <ModalHeader titleId={titleId} title={title} description={description} onClose={onClose} />
        <div className="overflow-y-auto px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
