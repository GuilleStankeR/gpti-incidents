import { Injectable, Logger } from '@nestjs/common';

import { ErrorCode, IncidentStatus } from '@incidents/shared';
import type { ReassignIncidentRequest, TransitionIncidentRequest } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';
import { UsersRepository } from '@/modules/users/users.repository';

import { assertReassignable } from './domain/reassignment-policy';
import { assertTransitionAllowed } from './domain/state-machine';
import {
  assertRoleCanTransition,
  assertTransitionRequirements,
  assertValidNote,
} from './domain/transition-policy';
import { IncidentWriteRepository } from './incident-write.repository';
import type { IncidentDetailEntity } from './incidents.repository';
import { IncidentsService } from './incidents.service';

@Injectable()
export class IncidentWorkflowService {
  private readonly logger = new Logger(IncidentWorkflowService.name);

  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentWriteRepository: IncidentWriteRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async transition(
    user: AuthenticatedUser,
    incidentId: string,
    input: TransitionIncidentRequest,
  ): Promise<IncidentDetailEntity> {
    const incident = await this.incidentsService.findDetail(user, incidentId);
    assertRoleCanTransition(user.role, input.targetStatus);
    assertTransitionAllowed(incident.status, input.targetStatus);
    assertTransitionRequirements({
      target: input.targetStatus,
      assigneeId: input.assigneeId,
      evidenceCount: incident.evidence.length,
      note: input.note,
    });
    const assigneeId = await this.resolveAssigneeForTransition(user, input);

    const isApplied = await this.incidentWriteRepository.applyStatusChange({
      incidentId,
      condominiumId: user.condominiumId,
      fromStatus: incident.status,
      toStatus: input.targetStatus,
      assigneeId,
      closedAt: input.targetStatus === IncidentStatus.CLOSED ? new Date() : undefined,
      userId: user.id,
      note: input.note,
    });
    this.ensureApplied(isApplied, ErrorCode.INVALID_TRANSITION);
    this.logNotification(incident, input.targetStatus, assigneeId ?? incident.assigneeId);

    return this.incidentsService.findDetail(user, incidentId);
  }

  async reassign(
    user: AuthenticatedUser,
    incidentId: string,
    input: ReassignIncidentRequest,
  ): Promise<IncidentDetailEntity> {
    const incident = await this.incidentsService.findDetail(user, incidentId);
    assertReassignable(incident.status);
    assertValidNote(input.note);
    await this.requireAssignableUser(user, input.assigneeId);

    const isApplied = await this.incidentWriteRepository.applyAssigneeChange({
      incidentId,
      condominiumId: user.condominiumId,
      status: incident.status,
      assigneeId: input.assigneeId,
      userId: user.id,
      note: input.note,
    });
    this.ensureApplied(isApplied, ErrorCode.INVALID_REASSIGNMENT);
    this.logNotification(incident, incident.status, input.assigneeId);

    return this.incidentsService.findDetail(user, incidentId);
  }

  private async resolveAssigneeForTransition(
    user: AuthenticatedUser,
    input: TransitionIncidentRequest,
  ): Promise<string | undefined> {
    if (input.targetStatus !== IncidentStatus.ASSIGNED || input.assigneeId === undefined) {
      return undefined;
    }

    await this.requireAssignableUser(user, input.assigneeId);
    return input.assigneeId;
  }

  private async requireAssignableUser(user: AuthenticatedUser, assigneeId: string): Promise<void> {
    const assignee = await this.usersRepository.findAssignableById(user.condominiumId, assigneeId);

    if (assignee === null) {
      throw new DomainError(ErrorCode.INVALID_ASSIGNEE);
    }
  }

  private ensureApplied(isApplied: boolean, errorCode: ErrorCode): void {
    if (!isApplied) {
      throw new DomainError(errorCode);
    }
  }

  private logNotification(
    incident: IncidentDetailEntity,
    status: IncidentStatus,
    assigneeId: string | null,
  ): void {
    this.logger.log(
      `Notification pending for incident ${incident.folio} (${status}): reporter ${incident.reporterId}, assignee ${assigneeId ?? 'none'}`,
    );
  }
}
