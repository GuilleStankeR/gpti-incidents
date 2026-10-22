import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';

import { Capability } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequireCapability } from '@/common/decorators/require-capability.decorator';
import { buildContentDisposition } from '@/common/http/content-disposition';
import { ResourceIdPipe } from '@/common/pipes/resource-id.pipe';

import { CaseFilesService } from './case-files.service';

const PDF_CONTENT_TYPE = 'application/pdf';
const PRIVATE_NO_STORE = 'private, no-store';

@Controller('incidents')
export class CaseFilesController {
  constructor(private readonly caseFilesService: CaseFilesService) {}

  @Get(':incidentId/case-file.pdf')
  @RequireCapability(Capability.DOWNLOAD_CASE_FILE)
  @Header('Cache-Control', PRIVATE_NO_STORE)
  async download(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId', ResourceIdPipe) incidentId: string,
  ): Promise<StreamableFile> {
    const caseFile = await this.caseFilesService.generate(user, incidentId);
    return new StreamableFile(caseFile.content, {
      type: PDF_CONTENT_TYPE,
      length: caseFile.content.length,
      disposition: buildContentDisposition('attachment', caseFile.fileName),
    });
  }
}
