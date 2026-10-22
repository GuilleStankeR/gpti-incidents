import type { Condominium, PrismaClient } from '@prisma/client';

import { DEMO_CONDOMINIUM } from '../data/condominium.data';

export async function seedCondominium(prisma: PrismaClient): Promise<Condominium> {
  return prisma.condominium.upsert({
    where: { code: DEMO_CONDOMINIUM.code },
    update: { name: DEMO_CONDOMINIUM.name, address: DEMO_CONDOMINIUM.address },
    create: DEMO_CONDOMINIUM,
  });
}
