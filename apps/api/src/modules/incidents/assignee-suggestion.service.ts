import { Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { subtractDays } from '@/common/time/date-math';
import { UsersRepository } from '@/modules/users/users.repository';

import { AssigneeSuggestionRepository } from './assignee-suggestion.repository';
import { pickSuggestedAssignee } from './domain/assignee-suggestion';
import type { AssigneeCandidate } from './domain/assignee-suggestion';
import { ASSIGNEE_EXPERIENCE_WINDOW_DAYS } from './domain/domain.constants';
import { IncidentsService } from './incidents.service';

@Injectable()
export class AssigneeSuggestionService {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly usersRepository: UsersRepository,
    private readonly assigneeSuggestionRepository: AssigneeSuggestionRepository,
  ) {}

  async suggest(user: AuthenticatedUser, incidentId: string): Promise<AssigneeCandidate | null> {
    const incident = await this.incidentsService.findDetail(user, incidentId);
    const [assignableUsers, closedInCategory, openAssigned] = await Promise.all([
      this.usersRepository.findAssignable(user.condominiumId),
      this.assigneeSuggestionRepository.countClosedInCategory({
        condominiumId: user.condominiumId,
        categoryCode: incident.categoryCode,
        closedSince: subtractDays(new Date(), ASSIGNEE_EXPERIENCE_WINDOW_DAYS),
      }),
      this.assigneeSuggestionRepository.countOpenAssigned(user.condominiumId),
    ]);
    const candidates = assignableUsers.map((assignableUser) => ({
      id: assignableUser.id,
      name: assignableUser.name,
      closedInCategory: closedInCategory.get(assignableUser.id) ?? 0,
      openAssigned: openAssigned.get(assignableUser.id) ?? 0,
    }));

    return pickSuggestedAssignee(candidates, incident.assigneeId);
  }
}
