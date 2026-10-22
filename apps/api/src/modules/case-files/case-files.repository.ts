import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';
import type { VisibilityScope } from '@/modules/incidents/domain/visibility';
import { toScopeFilter } from '@/modules/incidents/incidents.repository';

const CASE_FILE_INCLUDE = {
  condominium: true,
  category: true,
  reporter: true,
  assignee: true,
  evidence: { include: { uploadedBy: true }, orderBy: { createdAt: 'asc' } },
  auditTrail: { include: { user: true }, orderBy: { createdAt: 'asc' } },
} satisfies Prisma.IncidentInclude;

export type CaseFileEntity = Prisma.IncidentGetPayload<{ include: typeof CASE_FILE_INCLUDE }>;

@Injectable()
export class CaseFilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findForCaseFile(
    scope: VisibilityScope,
    incidentId: string,
  ): Promise<CaseFileEntity | null> {
    return this.prisma.incident.findFirst({
      where: { id: incidentId, ...toScopeFilter(scope) },
      include: CASE_FILE_INCLUDE,
    });
  }

  async findUserName(condominiumId: string, userId: string): Promise<string> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId, condominiumId },
      select: { name: true },
    });

    return user.name;
  }
}
