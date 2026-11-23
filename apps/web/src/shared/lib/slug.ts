const DIACRITIC_PATTERN = /\p{Diacritic}/gu;
const NON_ALPHANUMERIC_PATTERN = /[^a-z0-9]+/g;
const EDGE_DASHES_PATTERN = /^-+|-+$/g;
const SLUG_SEPARATOR = '-';

export function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replaceAll(DIACRITIC_PATTERN, '')
    .toLowerCase()
    .replaceAll(NON_ALPHANUMERIC_PATTERN, SLUG_SEPARATOR)
    .replaceAll(EDGE_DASHES_PATTERN, '');
}
