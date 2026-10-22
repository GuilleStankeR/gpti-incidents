import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '@prisma/client';

import { ASSIGNABLE_ROLES } from '@incidents/shared';

import { PrismaService } from '@/database/prisma.service';

export type UserWithCondominium = Prisma.UserGetPayload<{ include: { condominium: true } }>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmailWithCondominium(email: string): Promise<UserWithCondominium | null> {
    return this.prisma.user.findUnique({ where: { email }, include: { condominium: true } });
  }

  async findAssignable(condominiumId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { condominiumId, role: { in: [...ASSIGNABLE_ROLES] } },
      orderBy: { name: 'asc' },
    });
  }

  async findAssignableById(condominiumId: string, userId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id: userId, condominiumId, role: { in: [...ASSIGNABLE_ROLES] } },
    });
  }
}
