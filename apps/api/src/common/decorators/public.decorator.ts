import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

export const IS_PUBLIC_ROUTE_KEY = 'isPublicRoute';

export function Public(): CustomDecorator {
  return SetMetadata(IS_PUBLIC_ROUTE_KEY, true);
}
