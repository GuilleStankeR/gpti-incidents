import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { buildContentDisposition } from '@/common/http/content-disposition';
import { ResourceIdPipe } from '@/common/pipes/resource-id.pipe';

import { EvidenceDownloadService } from './evidence-download.service';

const PRIVATE_NO_STORE = 'private, no-store';

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceDownloadService: EvidenceDownloadService) {}

  @Get(':evidenceId/file')
  @Header('Cache-Control', PRIVATE_NO_STORE)
  async download(
    @CurrentUser() user: AuthenticatedUser,
    @Param('evidenceId', ResourceIdPipe) evidenceId: string,
  ): Promise<StreamableFile> {
    const file = await this.evidenceDownloadService.getFile(user, evidenceId);
    return new StreamableFile(file.content, {
      type: file.mimeType,
      length: file.content.length,
      disposition: buildContentDisposition('inline', file.originalName),
    });
  }
}
