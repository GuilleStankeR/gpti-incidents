import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';

export type UserWithCondominium = Prisma.UserGetPayload<{ include: { condominium: true } }>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmailWithCondominium(email: string): Promise<UserWithCondominium | null> {
    return this.prisma.user.findUnique({ where: { email }, include: { condominium: true } });
  }
}
