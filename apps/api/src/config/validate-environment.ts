import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import type { ValidationError } from 'class-validator';

import { Environment } from './environment';

function describeValidationError(error: ValidationError): string {
  const reasons = Object.values(error.constraints ?? {}).join('; ');
  return `  - ${error.property}: ${reasons}`;
}

export function validateEnvironment(rawEnvironment: Record<string, unknown>): Environment {
  const environment = plainToInstance(Environment, rawEnvironment, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(environment, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors.map(describeValidationError).join('\n');
    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  return environment;
}
