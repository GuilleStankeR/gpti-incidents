import { Inject, Injectable, Logger } from '@nestjs/common';

import { GEOCODER } from '@/modules/geocoding/geocoder.port';
import type { Coordinates, Geocoder } from '@/modules/geocoding/geocoder.port';

import { IncidentWriteRepository } from './incident-write.repository';

export interface GeocodingTarget {
  readonly incidentId: string;
  readonly condominiumId: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
}

function toCoordinates(target: GeocodingTarget): Coordinates | null {
  if (target.latitude === null || target.longitude === null) {
    return null;
  }

  return { latitude: target.latitude, longitude: target.longitude };
}

@Injectable()
export class IncidentGeocodingService {
  private readonly logger = new Logger(IncidentGeocodingService.name);

  constructor(
    @Inject(GEOCODER) private readonly geocoder: Geocoder,
    private readonly incidentWriteRepository: IncidentWriteRepository,
  ) {}

  async enrichWithAddress(target: GeocodingTarget): Promise<void> {
    const coordinates = toCoordinates(target);

    if (coordinates === null) {
      return;
    }

    try {
      const address = await this.geocoder.reverse(coordinates);

      if (address !== null) {
        await this.incidentWriteRepository.setGeocodedAddress(target, address);
      }
    } catch (error) {
      this.logger.warn(
        `Geocoded address not stored for incident ${target.incidentId}: ${String(error)}`,
      );
    }
  }
}
