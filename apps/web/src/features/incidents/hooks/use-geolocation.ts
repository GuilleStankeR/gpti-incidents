import { useState } from 'react';

import type { Coordinates } from '@/features/incidents/incident.types';

export type GeolocationStatus = 'idle' | 'locating' | 'granted' | 'denied' | 'unavailable';

export interface GeolocationState {
  readonly status: GeolocationStatus;
  readonly coordinates: Coordinates | null;
  readonly request: () => void;
  readonly clear: () => void;
}

const COORDINATE_DECIMALS = 7;
const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 60_000,
};

function roundCoordinate(value: number): number {
  return Number(value.toFixed(COORDINATE_DECIMALS));
}

export function useGeolocation(): GeolocationState {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const request = (): void => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }

    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: roundCoordinate(position.coords.latitude),
          longitude: roundCoordinate(position.coords.longitude),
        });
        setStatus('granted');
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable');
      },
      POSITION_OPTIONS,
    );
  };

  return {
    status,
    coordinates,
    request,
    clear: () => {
      setCoordinates(null);
      setStatus('idle');
    },
  };
}
