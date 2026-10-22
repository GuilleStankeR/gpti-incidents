import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import { requireAuthenticatedUser } from '@/common/auth/authenticated-request';
import type { AuthenticatedUser } from '@/common/auth/authenticated-user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser =>
    requireAuthenticatedUser(context),
);
