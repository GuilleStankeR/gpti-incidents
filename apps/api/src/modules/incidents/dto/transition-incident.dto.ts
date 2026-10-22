import { IsIn, IsOptional, IsUUID } from 'class-validator';

import { INCIDENT_STATUSES } from '@incidents/shared';
import type { IncidentStatus, TransitionIncidentRequest } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';

import { IsAuditNote } from './note.decorator';

export class TransitionIncidentDto implements TransitionIncidentRequest {
  @IsIn(INCIDENT_STATUSES, { message: validationMessages.statusInvalid })
  readonly targetStatus!: IncidentStatus;

  @IsOptional()
  @IsUUID('all', { message: validationMessages.assigneeInvalid })
  readonly assigneeId?: string;

  @IsAuditNote()
  readonly note!: string;
}
