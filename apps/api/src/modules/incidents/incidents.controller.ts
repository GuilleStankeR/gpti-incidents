import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import type { IncidentDetail, IncidentSummary, PaginatedResponse } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { PhotoFilesPipe } from '@/common/files/photo-files.pipe';
import { PhotoUploadInterceptor } from '@/common/files/photo-upload.interceptor';
import type { ValidatedPhoto } from '@/common/files/validated-photo';
import { ResourceIdPipe } from '@/common/pipes/resource-id.pipe';

import { CreateIncidentDto } from './dto/create-incident.dto';
import { ListIncidentsQueryDto } from './dto/list-incidents-query.dto';
import { IncidentRegistrationService } from './incident-registration.service';
import { toIncidentDetail, toIncidentPage } from './incidents.mapper';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentRegistrationService: IncidentRegistrationService,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListIncidentsQueryDto,
  ): Promise<PaginatedResponse<IncidentSummary>> {
    return toIncidentPage(await this.incidentsService.list(user, query));
  }

  @Post()
  @UseInterceptors(PhotoUploadInterceptor)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() input: CreateIncidentDto,
    @UploadedFiles(PhotoFilesPipe) photos: readonly ValidatedPhoto[],
  ): Promise<IncidentDetail> {
    const incident = await this.incidentRegistrationService.register(user, input, photos);
    return toIncidentDetail(incident, user.role);
  }

  @Get(':incidentId')
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId', ResourceIdPipe) incidentId: string,
  ): Promise<IncidentDetail> {
    return toIncidentDetail(await this.incidentsService.findDetail(user, incidentId), user.role);
  }
}
