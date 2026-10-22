import type { ReactElement } from 'react';

import type { IncidentDetail } from '@incidents/shared';

import { incidentDetailCopy } from '@/features/incidents/incident-detail.copy';
import { buildEmbeddedMapUrl } from '@/features/incidents/presentation/map-urls';
import { Card } from '@/shared/ui/Card';

import { MapLocationDetails } from './MapLocationDetails';

interface LocationCardProps {
  readonly incident: IncidentDetail;
}

export function LocationCard({ incident }: LocationCardProps): ReactElement {
  const copy = incidentDetailCopy.map;

  if (incident.latitude === null || incident.longitude === null) {
    return (
      <Card title={copy.title}>
        <p className="text-sm text-slate-500">{copy.noCoordinates}</p>
      </Card>
    );
  }

  const coordinates = { latitude: incident.latitude, longitude: incident.longitude };

  return (
    <Card title={copy.title}>
      <div className="flex flex-col gap-3">
        <iframe
          title={copy.iframeTitle(incident.folio)}
          src={buildEmbeddedMapUrl(coordinates)}
          loading="lazy"
          className="aspect-video w-full rounded-lg border border-slate-200"
        />
        <MapLocationDetails coordinates={coordinates} geocodedAddress={incident.geocodedAddress} />
      </div>
    </Card>
  );
}
