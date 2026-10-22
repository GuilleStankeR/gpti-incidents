import type { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

import { DEMO_PASSWORD, DEMO_USERS } from '../data/users.data';

const PASSWORD_HASH_ROUNDS = 10;

export async function seedUsers(prisma: PrismaClient, condominiumId: string): Promise<void> {
  const passwordHash = await hash(DEMO_PASSWORD, PASSWORD_HASH_ROUNDS);

  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, condominiumId },
      create: { ...user, condominiumId, passwordHash },
    });
  }
}
