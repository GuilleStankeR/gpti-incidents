import { useEffect } from 'react';
import type { RefObject } from 'react';

const ESCAPE_KEY = 'Escape';

export function useModalBehavior(
  isOpen: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose, panelRef]);
}
