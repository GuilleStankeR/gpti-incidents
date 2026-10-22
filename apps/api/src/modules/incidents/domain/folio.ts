import { FOLIO_SEPARATOR, FOLIO_SEQUENCE_DIGITS } from './domain.constants';

export function formatFolio(condominiumCode: string, year: number, sequence: number): string {
  const paddedSequence = String(sequence).padStart(FOLIO_SEQUENCE_DIGITS, '0');
  return [condominiumCode, String(year), paddedSequence].join(FOLIO_SEPARATOR);
}
