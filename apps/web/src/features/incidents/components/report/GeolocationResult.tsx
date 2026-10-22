import type { ReactElement } from 'react';

import type { Coordinates } from '@/features/incidents/incident.types';
import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { IconButton } from '@/shared/ui/IconButton';
import { Icon } from '@/shared/ui/icons/Icon';

interface GeolocationResultProps {
  readonly coordinates: Coordinates;
  readonly onClear: () => void;
}

export function GeolocationResult({ coordinates, onClear }: GeolocationResultProps): ReactElement {
  const copy = reportIncidentCopy.geolocation;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 py-1 pr-1 pl-3">
      <div className="flex items-center gap-3 text-emerald-900">
        <Icon name="mapPin" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{copy.granted}</span>
          <span className="font-mono text-xs text-emerald-800">
            {copy.coordinates(String(coordinates.latitude), String(coordinates.longitude))}
          </span>
        </div>
      </div>
      <IconButton icon="close" label={copy.remove} onClick={onClear} />
    </div>
  );
}
