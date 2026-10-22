import { Module } from '@nestjs/common';

import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';
import { CategoriesRepository } from './categories.repository';

@Module({
  controllers: [CatalogsController],
  providers: [CatalogsService, CategoriesRepository],
  exports: [CategoriesRepository],
})
export class CatalogsModule {}
