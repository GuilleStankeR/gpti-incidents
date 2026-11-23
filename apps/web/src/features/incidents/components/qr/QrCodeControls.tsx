import type { ReactElement } from 'react';

import type { ReportQrCodeState } from '@/features/incidents/hooks/use-report-qr-code';
import { qrCodesCopy } from '@/features/incidents/qr-codes.copy';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/icons/Icon';
import { InlineAlert } from '@/shared/ui/InlineAlert';
import { SelectField } from '@/shared/ui/SelectField';

interface QrCodeControlsProps {
  readonly qrCode: ReportQrCodeState;
  readonly locations: readonly string[];
}

export function QrCodeControls({ qrCode, locations }: QrCodeControlsProps): ReactElement {
  const copy = qrCodesCopy;

  return (
    <div className="print:hidden">
      <Card title={copy.settingsTitle}>
        <div className="flex flex-col gap-4">
          <SelectField
            label={copy.locationLabel}
            placeholder={copy.locationPlaceholder}
            hint={copy.locationHint}
            options={locations.map((location) => ({ value: location, label: location }))}
            value={qrCode.location}
            onChange={(event) => {
              qrCode.setLocation(event.target.value);
            }}
          />
          <p className="text-sm text-slate-500">{copy.loginHint}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button isLoading={qrCode.isDownloading} onClick={qrCode.download}>
              <Icon name="download" size="sm" />
              {copy.download}
            </Button>
            <Button variant="secondary" onClick={qrCode.print}>
              <Icon name="printer" size="sm" />
              {copy.print}
            </Button>
          </div>
          {qrCode.hasDownloadFailed ? (
            <InlineAlert tone="error">{copy.downloadError}</InlineAlert>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
