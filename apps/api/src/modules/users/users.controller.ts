import { Controller, Get } from '@nestjs/common';

import { Capability } from '@incidents/shared';
import type { UserWithRole } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequireCapability } from '@/common/decorators/require-capability.decorator';

import { toUserWithRole } from './users.mapper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('assignable')
  @RequireCapability(Capability.MANAGE_ASSIGNMENTS)
  async listAssignable(@CurrentUser() user: AuthenticatedUser): Promise<UserWithRole[]> {
    const assignableUsers = await this.usersService.listAssignable(user);
    return assignableUsers.map(toUserWithRole);
  }
}
