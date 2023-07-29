import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import Authentication from '@shared/decorators/authentication.decorator';
import Authorization from '@shared/decorators/authorization.decorator';
import UseList from '@shared/decorators/uselist.decorator';
import Context from '@shared/decorators/context.decorator';
import { IContext } from '@shared/interceptors/context.interceptor';
import SuccessResponse from '@shared/responses/success.response';
import Validator from '@shared/decorators/validator.decorator';
import Serializer from '@shared/decorators/serializer.decorator';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import SiteService from './site.service';
import ListSiteValidator, {
  ListSiteQueryValidator,
} from './validators/list-site.validator';
import GetSiteValidator, {
  GetSiteParamsValidator,
} from './validators/get-site.validator';
import GetSiteResponse from './serializers/get-site.response';
import ListSiteResponse from './serializers/list-site.response';
import CreateSiteValidator, {
  CreateSiteBodyValidator,
} from './validators/create-site.validator';
import CreateSiteResponse from './serializers/create-site.response';
import UpdateSiteValidator, {
  UpdateSiteBodyValidator,
  UpdateSiteParamsValidator,
} from './validators/update-site.validator';
import UpdateSiteResponse from './serializers/update-site.response';
import DeleteSiteValidator, {
  DeleteSiteParamsValidator,
} from './validators/delete-site.validator';
import DeleteSiteResponse from './serializers/delete-site.response';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';

@ApiTags('Site')
@ApiBearerAuth('access-token')
@Controller('auth/sites')
@OtelInstanceCounter()
export default class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('sites:read@auth')
  @UseList()
  @Serializer(ListSiteResponse)
  @OtelMethodCounter()
  public async getUserAll(): Promise<SuccessResponse> {
    const result = await this.siteService.getSiteAll();

    return new SuccessResponse('all user listed successfully', result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('sites:read@auth')
  @UseList()
  @Validator(ListSiteValidator)
  @Serializer(ListSiteResponse)
  @ApiFilterQuery('filters', ListSiteQueryValidator)
  @OtelMethodCounter()
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.siteService.list(ctx);

    return new SuccessResponse('sites listed successfully', result, meta);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('sites:read@auth')
  @Validator(GetSiteValidator)
  @Serializer(GetSiteResponse)
  @OtelMethodCounter()
  public async get(
    @Param() params: GetSiteParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.siteService.get(params);

    return new SuccessResponse('site fetched successfully', result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('sites:create@auth')
  @Validator(CreateSiteValidator)
  @Serializer(CreateSiteResponse)
  @OtelMethodCounter()
  public async create(
    @Context() ctx: IContext,
    @Body() body: CreateSiteBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.siteService.create(ctx, body);

    return new SuccessResponse('site created successfully', result);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('sites:update@auth')
  @Validator(UpdateSiteValidator)
  @Serializer(UpdateSiteResponse)
  @OtelMethodCounter()
  public async update(
    @Context() ctx: IContext,
    @Param() params: UpdateSiteParamsValidator,
    @Body() body: UpdateSiteBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.siteService.update(ctx, params, body);

    return new SuccessResponse('site fetched successfully', result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('sites:delete@auth')
  @Validator(DeleteSiteValidator)
  @Serializer(DeleteSiteResponse)
  @OtelMethodCounter()
  public async delete(
    @Context() ctx: IContext,
    @Param() params: DeleteSiteParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.siteService.delete(ctx, params);

    return new SuccessResponse('site deleted successfully', result);
  }
}
