import { Controller, Get, Query } from '@nestjs/common';

import type { PossibleDuplicatesResponse } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { PossibleDuplicatesQueryDto } from './dto/possible-duplicates-query.dto';
import { toPossibleDuplicatesResponse } from './possible-duplicates.mapper';
import { PossibleDuplicatesService } from './possible-duplicates.service';

@Controller('incidents')
export class PossibleDuplicatesController {
  constructor(private readonly possibleDuplicatesService: PossibleDuplicatesService) {}

  @Get('possible-duplicates')
  async search(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PossibleDuplicatesQueryDto,
  ): Promise<PossibleDuplicatesResponse> {
    return toPossibleDuplicatesResponse(await this.possibleDuplicatesService.search(user, query));
  }
}
