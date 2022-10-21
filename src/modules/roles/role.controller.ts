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
import RoleService from './role.service';
import ListRoleResponse from './serializers/list-role.response';
import ListRoleValidator, {
  ListRoleQueryValidator,
} from './validators/list-role.validator';
import GetRoleValidator, {
  GetRoleParamsValidator,
} from './validators/get-role.validator';
import GetRoleResponse from './serializers/get-role.response';
import CreateRoleValidator, {
  CreateRoleBodyValidator,
} from './validators/create-role.validator';
import UpdateRoleValidator, {
  UpdateRoleBodyValidator,
  UpdateRoleParamsValidator,
} from './validators/update-role.validator';
import UpdateRoleResponse from './serializers/update-role.response';
import CreateRoleResponse from './serializers/create-role.response';
import DeleteRoleValidator, {
  DeleteRoleParamsValidator,
} from './validators/delete-role.validator';
import DeleteRoleResponse from './serializers/delete-role.response';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import SuccessResponse from '@/shared/responses/success.response';
import Authentication from '@/shared/decorators/authentication.decorator';
import Authorization from '@/shared/decorators/authorization.decorator';
import UseList from '@/shared/decorators/uselist.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';

@ApiTags('Role')
@ApiBearerAuth('access-token')
@Controller('auth/roles')
export default class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('roles:read@auth')
  @UseList()
  @Serializer(ListRoleResponse)
  public async getUserAll(): Promise<SuccessResponse> {
    const result = await this.roleService.getRoleAll();

    return new SuccessResponse('all user listed successfully', result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('roles:read@auth')
  @UseList()
  @Validator(ListRoleValidator)
  @Serializer(ListRoleResponse)
  @ApiFilterQuery('filters', ListRoleQueryValidator)
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.roleService.list(ctx);

    return new SuccessResponse('roles listed successfully', result, meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('roles:read@auth')
  @Validator(GetRoleValidator)
  @Serializer(GetRoleResponse)
  public async get(
    @Param() params: GetRoleParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.roleService.get(params);

    return new SuccessResponse('role fetched successfully', result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('roles:create@auth')
  @Validator(CreateRoleValidator)
  @Serializer(CreateRoleResponse)
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
  @Validator(UpdateRoleValidator)
  @Serializer(UpdateRoleResponse)
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
  @Validator(DeleteRoleValidator)
  @Serializer(DeleteRoleResponse)
  public async delete(
    @Context() ctx: IContext,
    @Param() params: DeleteRoleParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.roleService.delete(ctx, params);

    return new SuccessResponse('role deleted successfully', result);
  }
}
