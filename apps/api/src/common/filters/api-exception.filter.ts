import { Catch, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

import { ErrorCode } from '@incidents/shared';

import { buildErrorResponse } from '@/common/errors/error-response';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const errorResponse = buildErrorResponse(exception);

    if (errorResponse.code === ErrorCode.INTERNAL_ERROR) {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    host.switchToHttp().getResponse<Response>().status(errorResponse.status).json(errorResponse);
  }
}
