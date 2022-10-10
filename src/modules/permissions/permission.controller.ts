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
export default class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('permissions:read@auth')
  @UseList()
  @Validator(ListPermissionValidator)
  @Serializer(ListPermissionResponse)
  @ApiFilterQuery('filters', ListPermissionQueryValidator)
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
  public async get(
    @Context() ctx: IContext,
    @Param() params: GetPermissionParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.permissionService.get(ctx, params);

    return new SuccessResponse('permission fetched successfully', result);
  }
}
