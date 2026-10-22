import { Injectable } from '@nestjs/common';
import type { Category } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ orderBy: [{ slaHours: 'asc' }, { name: 'asc' }] });
  }

  async findByCode(code: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { code } });
  }
}
