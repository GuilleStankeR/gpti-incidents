import type { PrismaClient } from '@prisma/client';

import { CATEGORIES } from '../data/categories.data';

export async function seedCategories(prisma: PrismaClient): Promise<void> {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { code: category.code },
      update: { name: category.name, slaHours: category.slaHours },
      create: category,
    });
  }
}
