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
import { updateIncidentIfInState } from './incident-state-guard.repository';

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

export interface IncidentRegistration {
  readonly draft: IncidentDraft;
  readonly photos: readonly ValidatedPhoto[];
  readonly auditNote: string;
}

export interface EvidenceAttachment {
  readonly incidentId: string;
  readonly condominiumId: string;
  readonly status: IncidentStatus;
  readonly uploadedById: string;
  readonly photos: readonly ValidatedPhoto[];
  readonly note: string;
}

@Injectable()
export class IncidentWriteRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly evidenceFiles: EvidenceFilesService,
    private readonly config: AppConfig,
  ) {}

  async register({ draft, photos, auditNote }: IncidentRegistration): Promise<string> {
    const storedPhotos = await this.evidenceFiles.store(draft.id, photos);

    return this.runOrDiscard(storedPhotos, async (transaction) => {
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

  async attachEvidence(attachment: EvidenceAttachment): Promise<boolean> {
    const storedPhotos = await this.evidenceFiles.store(attachment.incidentId, attachment.photos);
    const isAttached = await this.runOrDiscard(storedPhotos, async (transaction) => {
      const isStillInState = await updateIncidentIfInState(
        transaction,
        { ...attachment, expectedStatus: attachment.status },
        { status: attachment.status },
      );

      if (isStillInState) {
        await insertEvidenceBatch(transaction, { ...attachment, photos: storedPhotos });
        await appendAuditEntry(transaction, {
          incidentId: attachment.incidentId,
          fromStatus: attachment.status,
          toStatus: attachment.status,
          userId: attachment.uploadedById,
          note: attachment.note,
        });
      }

      return isStillInState;
    });

    if (!isAttached) {
      await this.evidenceFiles.discard(storedPhotos);
    }

    return isAttached;
  }

  private async runOrDiscard<TResult>(
    storedPhotos: readonly StoredPhoto[],
    work: (transaction: DatabaseTransaction) => Promise<TResult>,
  ): Promise<TResult> {
    try {
      return await this.prisma.$transaction(work);
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
