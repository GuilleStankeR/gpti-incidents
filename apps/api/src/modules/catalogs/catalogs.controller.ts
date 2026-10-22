import { Controller, Get } from '@nestjs/common';

import type { CatalogsResponse } from '@incidents/shared';

import { toCatalogsResponse } from './catalogs.mapper';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  async getCatalogs(): Promise<CatalogsResponse> {
    return toCatalogsResponse(await this.catalogsService.getCatalogs());
  }
}
