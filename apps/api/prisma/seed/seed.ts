import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { seedCategories } from './seeders/categories.seeder';
import { seedCondominium } from './seeders/condominium.seeder';
import { seedUsers } from './seeders/users.seeder';

const logger = new Logger('Seed');

async function seed(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const condominium = await seedCondominium(prisma);
    await seedCategories(prisma);
    await seedUsers(prisma, condominium.id);
    logger.log(`Seed completed for condominium ${condominium.code}`);
  } finally {
    await prisma.$disconnect();
  }
}

void seed();
