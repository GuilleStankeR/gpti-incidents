import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { ErrorCode } from '@incidents/shared';
import type { LoginRequest } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';
import { UsersRepository } from '@/modules/users/users.repository';
import type { UserWithCondominium } from '@/modules/users/users.repository';

import { AccessTokenService } from './access-token.service';

const TIMING_EQUALIZER_HASH = '$2b$10$TAuY6AxRa6IUzdEDlZUzR.11t0HOssXbmNP17rTPv3Bnc1STeGIli';

export interface AuthenticatedSession {
  readonly token: string;
  readonly user: UserWithCondominium;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async login(credentials: LoginRequest): Promise<AuthenticatedSession> {
    const user = await this.usersRepository.findByEmailWithCondominium(credentials.email);
    const isPasswordValid = await compare(
      credentials.password,
      user?.passwordHash ?? TIMING_EQUALIZER_HASH,
    );

    if (user === null || !isPasswordValid) {
      throw new DomainError(ErrorCode.INVALID_CREDENTIALS);
    }

    const token = await this.accessTokenService.sign({
      id: user.id,
      role: user.role,
      condominiumId: user.condominiumId,
    });

    return { token, user };
  }
}
