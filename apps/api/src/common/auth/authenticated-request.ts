import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { ErrorCode } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';

import type { AuthenticatedUser } from './authenticated-user';

export interface AuthenticatedRequest extends Request {
  authenticatedUser?: AuthenticatedUser;
}

export function getHttpRequest(context: ExecutionContext): AuthenticatedRequest {
  return context.switchToHttp().getRequest<AuthenticatedRequest>();
}

export function requireAuthenticatedUser(context: ExecutionContext): AuthenticatedUser {
  const { authenticatedUser } = getHttpRequest(context);

  if (authenticatedUser === undefined) {
    throw new DomainError(ErrorCode.UNAUTHENTICATED);
  }

  return authenticatedUser;
}
