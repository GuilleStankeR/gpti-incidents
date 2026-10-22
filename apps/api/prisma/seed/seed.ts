import { resolve } from 'node:path';

import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { validateEnvironment } from '@/config/validate-environment';

import { seedCategories } from './seeders/categories.seeder';
import { seedCondominium } from './seeders/condominium.seeder';
import { seedHistoricalIncidents } from './seeders/incidents.seeder';
import { seedUsers } from './seeders/users.seeder';

const logger = new Logger('Seed');

async function seed(): Promise<void> {
  const environment = validateEnvironment(process.env);
  const prisma = new PrismaClient();

  try {
    const condominium = await seedCondominium(prisma);
    await seedCategories(prisma);
    await seedUsers(prisma, condominium.id);
    const createdIncidents = await seedHistoricalIncidents(prisma, {
      condominiumId: condominium.id,
      condominiumCode: condominium.code,
      storageDirectory: resolve(environment.STORAGE_DIR),
      timeZone: environment.TIME_ZONE,
      now: new Date(),
    });
    logger.log(`Seed completed for condominium ${condominium.code}`);
    logger.log(
      createdIncidents > 0
        ? `Historical incidents created: ${String(createdIncidents)}`
        : 'Historical incidents skipped: the condominium already has incidents',
    );
  } finally {
    await prisma.$disconnect();
  }
}

void seed();
