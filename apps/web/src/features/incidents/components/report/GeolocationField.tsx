import type { ReactElement } from 'react';

import type { GeolocationState } from '@/features/incidents/hooks/use-geolocation';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/icons/Icon';

import { GeolocationResult } from './GeolocationResult';

interface GeolocationFieldProps {
  readonly geolocation: GeolocationState;
}

export function GeolocationField({ geolocation }: GeolocationFieldProps): ReactElement {
  const copy = reportIncidentCopy.geolocation;

  if (geolocation.coordinates !== null) {
    return <GeolocationResult coordinates={geolocation.coordinates} onClear={geolocation.clear} />;
  }

  const isFailed = geolocation.status === 'denied' || geolocation.status === 'unavailable';

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        isLoading={geolocation.status === 'locating'}
        onClick={geolocation.request}
      >
        <Icon name="mapPin" size="sm" />
        {isFailed ? copy.retry : copy.use}
      </Button>
      <p className="text-sm text-slate-500">
        {geolocation.status === 'denied' ? copy.denied : null}
        {geolocation.status === 'unavailable' ? copy.unavailable : null}
        {isFailed ? null : copy.hint}
      </p>
    </div>
  );
}
