import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ErrorCode, ROLES } from '@incidents/shared';
import type { Role } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { DomainError } from '@/common/errors/domain-error';

interface AccessTokenPayload {
  readonly sub: string;
  readonly role: Role;
  readonly condominiumId: string;
}

function isAccessTokenPayload(payload: Partial<AccessTokenPayload>): payload is AccessTokenPayload {
  return (
    typeof payload.sub === 'string' &&
    typeof payload.condominiumId === 'string' &&
    payload.role !== undefined &&
    ROLES.includes(payload.role)
  );
}

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(user: AuthenticatedUser): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      role: user.role,
      condominiumId: user.condominiumId,
    };

    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<AuthenticatedUser> {
    const payload = await this.decode(token);

    if (!isAccessTokenPayload(payload)) {
      throw new DomainError(ErrorCode.UNAUTHENTICATED);
    }

    return { id: payload.sub, role: payload.role, condominiumId: payload.condominiumId };
  }

  private async decode(token: string): Promise<Partial<AccessTokenPayload>> {
    try {
      return await this.jwtService.verifyAsync<Partial<AccessTokenPayload>>(token);
    } catch {
      throw new DomainError(ErrorCode.UNAUTHENTICATED);
    }
  }
}
