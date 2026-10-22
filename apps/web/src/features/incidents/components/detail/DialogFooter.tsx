import type { ReactElement } from 'react';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { Button } from '@/shared/ui/Button';
import type { ButtonVariant } from '@/shared/ui/button-styles';
import { InlineAlert } from '@/shared/ui/InlineAlert';

interface DialogFooterProps {
  readonly confirmLabel: string;
  readonly confirmVariant: ButtonVariant;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly onCancel: () => void;
}

export function DialogFooter({
  confirmLabel,
  confirmVariant,
  isSubmitting,
  errorMessage,
  onCancel,
}: DialogFooterProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {errorMessage === null ? null : (
        <InlineAlert tone="error" title={incidentDetailCopy.dialogs.errorTitle}>
          {errorMessage}
        </InlineAlert>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          {incidentDetailCopy.dialogs.cancel}
        </Button>
        <Button type="submit" variant={confirmVariant} isLoading={isSubmitting}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
