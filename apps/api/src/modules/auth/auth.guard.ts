import { Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ErrorCode } from '@incidents/shared';

import { getHttpRequest } from '@/common/auth/authenticated-request';
import { IS_PUBLIC_ROUTE_KEY } from '@/common/decorators/public.decorator';
import { DomainError } from '@/common/errors/domain-error';

import { AccessTokenService } from './access-token.service';

const BEARER_PREFIX = 'Bearer ';

function extractBearerToken(authorizationHeader: string | undefined): string {
  if (authorizationHeader?.startsWith(BEARER_PREFIX) !== true) {
    throw new DomainError(ErrorCode.UNAUTHENTICATED);
  }

  return authorizationHeader.slice(BEARER_PREFIX.length);
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean | undefined>(
      IS_PUBLIC_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute === true) {
      return true;
    }

    const request = getHttpRequest(context);
    const token = extractBearerToken(request.headers.authorization);
    request.authenticatedUser = await this.accessTokenService.verify(token);

    return true;
  }
}
