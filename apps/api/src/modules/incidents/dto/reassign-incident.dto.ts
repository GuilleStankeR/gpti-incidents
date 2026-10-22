import { IsUUID } from 'class-validator';

import type { ReassignIncidentRequest } from '@incidents/shared';

import { validationMessages } from '@/common/errors/validation-messages.copy';

import { IsAuditNote } from './note.decorator';

export class ReassignIncidentDto implements ReassignIncidentRequest {
  @IsUUID('all', { message: validationMessages.assigneeInvalid })
  readonly assigneeId!: string;

  @IsAuditNote()
  readonly note!: string;
}
