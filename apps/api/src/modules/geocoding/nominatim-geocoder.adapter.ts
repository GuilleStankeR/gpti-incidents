import { Injectable, Logger } from '@nestjs/common';

import { AppConfig } from '@/config/app-config';

import type { Coordinates, Geocoder } from './geocoder.port';
import { formatNominatimAddress } from './nominatim-address';

const RESPONSE_FORMAT = 'jsonv2';
const RESPONSE_LANGUAGE = 'es';

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

@Injectable()
export class NominatimGeocoderAdapter implements Geocoder {
  private readonly logger = new Logger(NominatimGeocoderAdapter.name);

  constructor(private readonly config: AppConfig) {}

  async reverse(coordinates: Coordinates): Promise<string | null> {
    const { url, userAgent, timeoutMs } = this.config.nominatim;

    try {
      const response = await fetch(this.buildRequestUrl(url, coordinates), {
        headers: { 'User-Agent': userAgent, 'Accept-Language': RESPONSE_LANGUAGE },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        this.logger.warn(`Reverse geocoding responded with status ${String(response.status)}`);
        return null;
      }

      return formatNominatimAddress(await response.json());
    } catch (error) {
      this.logger.warn(`Reverse geocoding failed: ${describeError(error)}`);
      return null;
    }
  }

  private buildRequestUrl(baseUrl: string, coordinates: Coordinates): string {
    const url = new URL(baseUrl);
    url.searchParams.set('format', RESPONSE_FORMAT);
    url.searchParams.set('lat', String(coordinates.latitude));
    url.searchParams.set('lon', String(coordinates.longitude));
    return url.toString();
  }
}
