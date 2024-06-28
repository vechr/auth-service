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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import RoleService from './role.service';
import ListRoleResponse from './serializers/list-role.response';
import { ListRoleQueryValidator } from './validators/list-role.validator';
import { GetRoleParamsValidator } from './validators/get-role.validator';
import GetRoleResponse from './serializers/get-role.response';
import { CreateRoleBodyValidator } from './validators/create-role.validator';
import {
  UpdateRoleBodyValidator,
  UpdateRoleParamsValidator,
} from './validators/update-role.validator';
import UpdateRoleResponse from './serializers/update-role.response';
import CreateRoleResponse from './serializers/create-role.response';
import { DeleteRoleParamsValidator } from './validators/delete-role.validator';
import DeleteRoleResponse from './serializers/delete-role.response';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';
import UseList from '@/core/base/frameworks/shared/decorators/uselist.decorator';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import { ApiFilterQuery } from '@/core/base/frameworks/shared/decorators/api-filter-query.decorator';

@ApiTags('Role')
@ApiBearerAuth('access-token')
@Controller('auth/roles')
@OtelInstanceCounter()
export default class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('roles:read@auth')
  @UseList()
  @Serializer(ListRoleResponse)
  @OtelMethodCounter()
  public async getUserAll(): Promise<SuccessResponse> {
    const result = await this.roleService.getRoleAll();

    return new SuccessResponse('all user listed successfully', result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('roles:read@auth')
  @UseList()
  @Serializer(ListRoleResponse)
  @ApiFilterQuery('filters', ListRoleQueryValidator)
  @OtelMethodCounter()
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.roleService.list(ctx);

    return new SuccessResponse('roles listed successfully', result, meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('roles:read@auth')
  @Serializer(GetRoleResponse)
  @OtelMethodCounter()
  public async get(@Param() params: GetRoleParamsValidator): Promise<SuccessResponse> {
    const result = await this.roleService.get(params);

    return new SuccessResponse('role fetched successfully', result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('roles:create@auth')
  @Serializer(CreateRoleResponse)
  @OtelMethodCounter()
  public async create(
    @Context() ctx: IContext,
    @Body() body: CreateRoleBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.roleService.create(ctx, body);

    return new SuccessResponse('role created successfully', result);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('roles@update@auth')
  @Serializer(UpdateRoleResponse)
  @OtelMethodCounter()
  public async update(
    @Context() ctx: IContext,
    @Param() params: UpdateRoleParamsValidator,
    @Body() body: UpdateRoleBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.roleService.update(ctx, params, body);

    return new SuccessResponse('role fetched successfully', result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('roles:delete@auth')
  @Serializer(DeleteRoleResponse)
  @OtelMethodCounter()
  public async delete(
    @Context() ctx: IContext,
    @Param() params: DeleteRoleParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.roleService.delete(ctx, params);

    return new SuccessResponse('role deleted successfully', result);
  }
}
