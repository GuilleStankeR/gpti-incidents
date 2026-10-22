import type { ReactElement } from 'react';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import type { Coordinates } from '@/features/incidents/incident.types';
import { buildExternalMapUrl } from '@/features/incidents/presentation/map-urls';
import { Icon } from '@/shared/ui/icons/Icon';

interface MapLocationDetailsProps {
  readonly coordinates: Coordinates;
  readonly geocodedAddress: string | null;
}

export function MapLocationDetails({
  coordinates,
  geocodedAddress,
}: MapLocationDetailsProps): ReactElement {
  const copy = incidentDetailCopy.map;

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">
          {geocodedAddress ?? copy.addressPending}
        </span>
        <span className="font-mono text-xs text-slate-500">
          {copy.coordinates(String(coordinates.latitude), String(coordinates.longitude))}
        </span>
      </div>
      <a
        href={buildExternalMapUrl(coordinates)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium whitespace-nowrap text-accent hover:underline"
      >
        {copy.openExternal}
        <Icon name="external" size="sm" />
      </a>
    </div>
  );
}
