import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { Capability } from '@incidents/shared';
import type { IncidentDetail, IncidentSummary, PaginatedResponse } from '@incidents/shared';

import type { AuthenticatedUser } from '@/common/auth/authenticated-user';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequireCapability } from '@/common/decorators/require-capability.decorator';
import { PhotoFilesPipe } from '@/common/files/photo-files.pipe';
import { PhotoUploadInterceptor } from '@/common/files/photo-upload.interceptor';
import type { ValidatedPhoto } from '@/common/files/validated-photo';
import { ResourceIdPipe } from '@/common/pipes/resource-id.pipe';

import { CreateIncidentDto } from './dto/create-incident.dto';
import { ListIncidentsQueryDto } from './dto/list-incidents-query.dto';
import { ReassignIncidentDto } from './dto/reassign-incident.dto';
import { TransitionIncidentDto } from './dto/transition-incident.dto';
import { IncidentRegistrationService } from './incident-registration.service';
import { IncidentWorkflowService } from './incident-workflow.service';
import { toIncidentDetail, toIncidentPage } from './incidents.mapper';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentRegistrationService: IncidentRegistrationService,
    private readonly incidentWorkflowService: IncidentWorkflowService,
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

  @Post(':incidentId/transitions')
  @HttpCode(HttpStatus.OK)
  async transition(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId', ResourceIdPipe) incidentId: string,
    @Body() input: TransitionIncidentDto,
  ): Promise<IncidentDetail> {
    const incident = await this.incidentWorkflowService.transition(user, incidentId, input);
    return toIncidentDetail(incident, user.role);
  }

  @Patch(':incidentId/assignee')
  @RequireCapability(Capability.MANAGE_ASSIGNMENTS)
  async reassign(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId', ResourceIdPipe) incidentId: string,
    @Body() input: ReassignIncidentDto,
  ): Promise<IncidentDetail> {
    const incident = await this.incidentWorkflowService.reassign(user, incidentId, input);
    return toIncidentDetail(incident, user.role);
  }
}
