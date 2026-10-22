import { Injectable } from '@nestjs/common';

import { IncidentStatus } from '@incidents/shared';

import type { ValidatedPhoto } from '@/common/files/validated-photo';
import { getYearInTimeZone } from '@/common/time/date-math';
import { AppConfig } from '@/config/app-config';
import type { DatabaseTransaction } from '@/database/database-transaction';
import { PrismaService } from '@/database/prisma.service';
import { EvidenceFilesService } from '@/modules/evidence/evidence-files.service';
import { insertEvidenceBatch } from '@/modules/evidence/evidence.repository';
import type { StoredPhoto } from '@/modules/evidence/stored-photo';

import { appendAuditEntry } from './audit-trail.repository';
import { formatFolio } from './domain/folio';
import { incrementFolioCounter } from './folio-counter.repository';

export interface IncidentDraft {
  readonly id: string;
  readonly condominiumId: string;
  readonly categoryCode: string;
  readonly description: string;
  readonly location: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly occurredAt: Date;
  readonly reportedAt: Date;
  readonly dueAt: Date;
  readonly reporterId: string;
}

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

export interface IncidentRegistration {
  readonly draft: IncidentDraft;
  readonly photos: readonly ValidatedPhoto[];
  readonly auditNote: string;
}

@Injectable()
export class IncidentWriteRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly evidenceFiles: EvidenceFilesService,
    private readonly config: AppConfig,
  ) {}

  async register({ draft, photos, auditNote }: IncidentRegistration): Promise<string> {
    return this.withStoredPhotos(draft.id, photos, async (transaction, storedPhotos) => {
      const folio = await this.generateFolio(transaction, draft);
      await transaction.incident.create({ data: { ...draft, folio } });
      await insertEvidenceBatch(transaction, {
        incidentId: draft.id,
        uploadedById: draft.reporterId,
        photos: storedPhotos,
      });
      await appendAuditEntry(transaction, {
        incidentId: draft.id,
        fromStatus: null,
        toStatus: IncidentStatus.REPORTED,
        userId: draft.reporterId,
        note: auditNote,
      });

      return folio;
    });
  }

  async applyStatusChange(change: StatusChange): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      const { count } = await transaction.incident.updateMany({
        where: {
          id: change.incidentId,
          condominiumId: change.condominiumId,
          status: change.fromStatus,
        },
        data: { status: change.toStatus, assigneeId: change.assigneeId, closedAt: change.closedAt },
      });

      if (count === 0) {
        return false;
      }

      await appendAuditEntry(transaction, {
        incidentId: change.incidentId,
        fromStatus: change.fromStatus,
        toStatus: change.toStatus,
        userId: change.userId,
        note: change.note,
      });

      return true;
    });
  }

  async applyAssigneeChange(change: AssigneeChange): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      const { count } = await transaction.incident.updateMany({
        where: {
          id: change.incidentId,
          condominiumId: change.condominiumId,
          status: change.status,
        },
        data: { assigneeId: change.assigneeId },
      });

      if (count === 0) {
        return false;
      }

      await appendAuditEntry(transaction, {
        incidentId: change.incidentId,
        fromStatus: change.status,
        toStatus: change.status,
        userId: change.userId,
        note: change.note,
      });

      return true;
    });
  }

  private async withStoredPhotos<TResult>(
    incidentId: string,
    photos: readonly ValidatedPhoto[],
    work: (
      transaction: DatabaseTransaction,
      storedPhotos: readonly StoredPhoto[],
    ) => Promise<TResult>,
  ): Promise<TResult> {
    const storedPhotos = await this.evidenceFiles.store(incidentId, photos);

    try {
      return await this.prisma.$transaction(async (transaction) => work(transaction, storedPhotos));
    } catch (error) {
      await this.evidenceFiles.discard(storedPhotos);
      throw error;
    }
  }

  private async generateFolio(
    transaction: DatabaseTransaction,
    draft: IncidentDraft,
  ): Promise<string> {
    const { code } = await transaction.condominium.findUniqueOrThrow({
      where: { id: draft.condominiumId },
      select: { code: true },
    });
    const year = getYearInTimeZone(draft.reportedAt, this.config.timeZone);
    const sequence = await incrementFolioCounter(transaction, draft.condominiumId, year);

    return formatFolio(code, year, sequence);
  }
}
