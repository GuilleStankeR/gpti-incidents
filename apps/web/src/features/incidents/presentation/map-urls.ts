import type { Coordinates } from '@/features/incidents/incident.types';

const OPEN_STREET_MAP_HOST = 'https://www.openstreetmap.org';
const BOUNDING_BOX_DELTA = 0.003;
const EXTERNAL_MAP_ZOOM = 18;

export function buildEmbeddedMapUrl({ latitude, longitude }: Coordinates): string {
  const boundingBox = [
    longitude - BOUNDING_BOX_DELTA,
    latitude - BOUNDING_BOX_DELTA,
    longitude + BOUNDING_BOX_DELTA,
    latitude + BOUNDING_BOX_DELTA,
  ].join(',');
  const params = new URLSearchParams({
    bbox: boundingBox,
    layer: 'mapnik',
    marker: `${String(latitude)},${String(longitude)}`,
  });

  return `${OPEN_STREET_MAP_HOST}/export/embed.html?${params.toString()}`;
}

export function buildExternalMapUrl({ latitude, longitude }: Coordinates): string {
  const params = new URLSearchParams({ mlat: String(latitude), mlon: String(longitude) });
  return `${OPEN_STREET_MAP_HOST}/?${params.toString()}#map=${String(EXTERNAL_MAP_ZOOM)}/${String(latitude)}/${String(longitude)}`;
}
