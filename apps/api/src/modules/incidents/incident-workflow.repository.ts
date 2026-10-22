import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import type { IncidentStatus } from '@incidents/shared';

import { PrismaService } from '@/database/prisma.service';

import { appendAuditEntry } from './audit-trail.repository';
import type { NewAuditEntry } from './audit-trail.repository';
import { updateIncidentIfInState } from './incident-state-guard.repository';
import type { IncidentStateGuard } from './incident-state-guard.repository';

export interface StatusChange {
  readonly incidentId: string;
  readonly condominiumId: string;
  readonly fromStatus: IncidentStatus;
  readonly toStatus: IncidentStatus;
  readonly assigneeId?: string;
  readonly closedAt?: Date;
  readonly userId: string;
  readonly note: string;
}

export interface AssigneeChange {
  readonly incidentId: string;
  readonly condominiumId: string;
  readonly status: IncidentStatus;
  readonly assigneeId: string;
  readonly userId: string;
  readonly note: string;
}

@Injectable()
export class IncidentWorkflowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async applyStatusChange(change: StatusChange): Promise<boolean> {
    return this.applyGuardedChange(
      { ...change, expectedStatus: change.fromStatus },
      { status: change.toStatus, assigneeId: change.assigneeId, closedAt: change.closedAt },
      { ...change },
    );
  }

  async applyAssigneeChange(change: AssigneeChange): Promise<boolean> {
    return this.applyGuardedChange(
      { ...change, expectedStatus: change.status },
      { assigneeId: change.assigneeId },
      { ...change, fromStatus: change.status, toStatus: change.status },
    );
  }

  private async applyGuardedChange(
    guard: IncidentStateGuard,
    data: Prisma.IncidentUncheckedUpdateManyInput,
    auditEntry: NewAuditEntry,
  ): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      const isUpdated = await updateIncidentIfInState(transaction, guard, data);

      if (isUpdated) {
        await appendAuditEntry(transaction, auditEntry);
      }

      return isUpdated;
    });
  }
}
