export const GEOCODER = Symbol('GEOCODER');

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface Geocoder {
  readonly reverse: (coordinates: Coordinates) => Promise<string | null>;
}
