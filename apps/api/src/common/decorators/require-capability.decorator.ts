import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

import type { Capability } from '@incidents/shared';

export const REQUIRED_CAPABILITY_KEY = 'requiredCapability';

export function RequireCapability(capability: Capability): CustomDecorator {
  return SetMetadata(REQUIRED_CAPABILITY_KEY, capability);
}
