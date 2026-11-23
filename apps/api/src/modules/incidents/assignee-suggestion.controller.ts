import { Controller, Get, Param } from '@nestjs/common';

import { Capability } from '@incidents/shared';
import type { AssigneeSuggestionResponse } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequireCapability } from '@/common/decorators/require-capability.decorator';
import { ResourceIdPipe } from '@/common/pipes/resource-id.pipe';

import { toAssigneeSuggestionResponse } from './assignee-suggestion.mapper';
import { AssigneeSuggestionService } from './assignee-suggestion.service';

@Controller('incidents')
export class AssigneeSuggestionController {
  constructor(private readonly assigneeSuggestionService: AssigneeSuggestionService) {}

  @Get(':incidentId/assignee-suggestion')
  @RequireCapability(Capability.MANAGE_ASSIGNMENTS)
  async suggest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId', ResourceIdPipe) incidentId: string,
  ): Promise<AssigneeSuggestionResponse> {
    const candidate = await this.assigneeSuggestionService.suggest(user, incidentId);
    return toAssigneeSuggestionResponse(candidate);
  }
}
