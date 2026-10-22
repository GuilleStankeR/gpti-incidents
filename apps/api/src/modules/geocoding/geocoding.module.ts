import { Module } from '@nestjs/common';

import { GEOCODER } from './geocoder.port';
import { NominatimGeocoderAdapter } from './nominatim-geocoder.adapter';

@Module({
  providers: [{ provide: GEOCODER, useClass: NominatimGeocoderAdapter }],
  exports: [GEOCODER],
})
export class GeocodingModule {}
