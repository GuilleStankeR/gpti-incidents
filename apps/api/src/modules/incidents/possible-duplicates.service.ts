import { Injectable } from '@nestjs/common';

import { DUPLICATE_WINDOW_HOURS } from '@incidents/shared';
import type { PossibleDuplicatesQuery } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { addHours } from '@/common/time/date-math';

import { separateVisibleDuplicates } from './domain/possible-duplicates';
import type { VisibleDuplicates } from './domain/possible-duplicates';
import { buildVisibilityScope } from './domain/visibility';
import { PossibleDuplicatesRepository } from './possible-duplicates.repository';

@Injectable()
export class PossibleDuplicatesService {
  constructor(private readonly possibleDuplicatesRepository: PossibleDuplicatesRepository) {}

  async search(
    user: AuthenticatedUser,
    query: PossibleDuplicatesQuery,
  ): Promise<VisibleDuplicates> {
    const candidates = await this.possibleDuplicatesRepository.findOpenMatches({
      condominiumId: user.condominiumId,
      categoryCode: query.category,
      location: query.location,
      reportedSince: addHours(new Date(), -DUPLICATE_WINDOW_HOURS),
    });

    return separateVisibleDuplicates(candidates, buildVisibilityScope(user));
  }
}
