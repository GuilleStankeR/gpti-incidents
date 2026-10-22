import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

import { ErrorCode } from '@incidents/shared';

import { DomainError } from '@/common/errors/domain-error';

@Injectable()
export class ResourceIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isUUID(value)) {
      throw new DomainError(ErrorCode.RESOURCE_NOT_FOUND);
    }

    return value;
  }
}
