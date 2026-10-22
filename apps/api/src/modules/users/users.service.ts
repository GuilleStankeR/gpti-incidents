import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async listAssignable(user: AuthenticatedUser): Promise<User[]> {
    return this.usersRepository.findAssignable(user.condominiumId);
  }
}
