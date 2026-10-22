import type { Prisma } from '@prisma/client';

interface FolioCounterRow {
  readonly lastSequence: number;
}

export async function incrementFolioCounter(
  transaction: Prisma.TransactionClient,
  condominiumId: string,
  year: number,
): Promise<number> {
  const [row] = await transaction.$queryRaw<FolioCounterRow[]>`
    INSERT INTO folio_counter (condominium_id, year, last_sequence)
    VALUES (${condominiumId}::uuid, ${year}, 1)
    ON CONFLICT (condominium_id, year)
    DO UPDATE SET last_sequence = folio_counter.last_sequence + 1
    RETURNING last_sequence AS "lastSequence"
  `;

  if (row === undefined) {
    throw new Error('Folio counter upsert returned no rows');
  }

  return row.lastSequence;
}
