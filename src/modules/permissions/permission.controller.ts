import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import SuccessResponse from '@shared/responses/success.response';
import Context from '@shared/decorators/context.decorator';
import { IContext } from '@shared/interceptors/context.interceptor';
import Authentication from '@shared/decorators/authentication.decorator';
import Authorization from '@shared/decorators/authorization.decorator';
import Serializer from '@shared/decorators/serializer.decorator';
import Validator from '@shared/decorators/validator.decorator';
import UseList from '@shared/decorators/uselist.decorator';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import PermissionService from './permission.service';
import ListPermissionValidator, {
  ListPermissionQueryValidator,
} from './validators/list-permission.validator';
import ListPermissionResponse from './serializers/list-permission.response';
import GetPermissionResponse from './serializers/get-permission.response';
import GetPermissionValidator, {
  GetPermissionParamsValidator,
} from './validators/get-permission.validator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';

@ApiTags('Permission')
@ApiBearerAuth('access-token')
@Controller('auth/permissions')
@OtelInstanceCounter()
export default class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @UseList()
  @Serializer(ListPermissionResponse)
  @OtelMethodCounter()
  public async getUserAll(): Promise<SuccessResponse> {
    const result = await this.permissionService.getPermissionAll();

    return new SuccessResponse('all user listed successfully', result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('permissions:read@auth')
  @UseList()
  @Validator(ListPermissionValidator)
  @Serializer(ListPermissionResponse)
  @ApiFilterQuery('filters', ListPermissionQueryValidator)
  @OtelMethodCounter()
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.permissionService.list(ctx);

    return new SuccessResponse('permissions listed successfully', result, meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('permissions:read@auth')
  @Validator(GetPermissionValidator)
  @Serializer(GetPermissionResponse)
  @OtelMethodCounter()
  public async get(
    @Context() ctx: IContext,
    @Param() params: GetPermissionParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.permissionService.get(ctx, params);

    return new SuccessResponse('permission fetched successfully', result);
  }
}
