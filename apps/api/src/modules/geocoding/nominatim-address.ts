type AddressParts = Readonly<Record<string, unknown>>;

const STREET_KEYS = ['road', 'pedestrian', 'footway', 'residential'];
const HOUSE_NUMBER_KEYS = ['house_number'];
const LOCALITY_KEYS = ['suburb', 'city_district', 'city', 'town', 'municipality', 'village'];
const ADDRESS_KEY = 'address';
const DISPLAY_NAME_KEY = 'display_name';
const PART_SEPARATOR = ', ';
const WORD_SEPARATOR = ' ';

function isRecord(value: unknown): value is AddressParts {
  return typeof value === 'object' && value !== null;
}

function pickFirstText(parts: AddressParts, keys: readonly string[]): string | undefined {
  return keys
    .map((key) => parts[key])
    .find((value): value is string => typeof value === 'string' && value.length > 0);
}

function formatStreet(parts: AddressParts): string | undefined {
  const street = pickFirstText(parts, STREET_KEYS);

  if (street === undefined) {
    return undefined;
  }

  const houseNumber = pickFirstText(parts, HOUSE_NUMBER_KEYS);
  return houseNumber === undefined ? street : [street, houseNumber].join(WORD_SEPARATOR);
}

function formatFromParts(parts: AddressParts): string | null {
  const segments = [formatStreet(parts), pickFirstText(parts, LOCALITY_KEYS)].filter(
    (segment): segment is string => segment !== undefined,
  );

  return segments.length > 0 ? segments.join(PART_SEPARATOR) : null;
}

export function formatNominatimAddress(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  const address = payload[ADDRESS_KEY];
  const formatted = isRecord(address) ? formatFromParts(address) : null;
  const displayName = payload[DISPLAY_NAME_KEY];

  return formatted ?? (typeof displayName === 'string' ? displayName : null);
}
