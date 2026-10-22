import { Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ErrorCode, hasCapability } from '@incidents/shared';
import type { Capability } from '@incidents/shared';

import { requireAuthenticatedUser } from '@/common/auth/authenticated-request';
import { REQUIRED_CAPABILITY_KEY } from '@/common/decorators/require-capability.decorator';
import { DomainError } from '@/common/errors/domain-error';

@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredCapability = this.reflector.getAllAndOverride<Capability | undefined>(
      REQUIRED_CAPABILITY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredCapability === undefined) {
      return true;
    }

    if (!hasCapability(requireAuthenticatedUser(context).role, requiredCapability)) {
      throw new DomainError(ErrorCode.FORBIDDEN_ROLE);
    }

    return true;
  }
}
