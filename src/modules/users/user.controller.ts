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
import UserService from './user.service';
import GetUserResponse from './serializers/get-user.response';
import GetUserValidator, {
  GetUserParamsValidator,
} from './validators/get-user.validator';
import ListUserValidator, {
  ListUserQueryValidator,
} from './validators/list-user.validator';
import ListUserResponse from './serializers/list-user.response';
import CreateUserValidator, {
  CreateUserBodyValidator,
} from './validators/create-user.validator';
import UpdateUserValidator, {
  UpdateUserBodyValidator,
  UpdateUserParamsValidator,
} from './validators/update-user.validator';
import UpdateUserResponse from './serializers/update-user.response';
import DeleteUserValidator, {
  DeleteUserParamsValidator,
} from './validators/delete-user.validator';
import DeleteUserResponse from './serializers/delete-user.response';
import SuccessResponse from '@/shared/responses/success.response';
import Authorization from '@/shared/decorators/authorization.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';
import UseList from '@/shared/decorators/uselist.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
import User from '@/shared/decorators/user.decorator';
import { TUserCustomInformation } from '@/shared/types/user.type';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('auth/users')
@OtelInstanceCounter()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('users:read@auth')
  @UseList()
  @Serializer(ListUserResponse)
  @OtelMethodCounter()
  public async getUserAll(): Promise<SuccessResponse> {
    const result = await this.userService.getUserAll();

    return new SuccessResponse('all user listed successfully', result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('users:read@auth')
  @UseList()
  @Validator(ListUserValidator)
  @Serializer(ListUserResponse)
  @ApiFilterQuery('filters', ListUserQueryValidator)
  @OtelMethodCounter()
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.userService.list(ctx);

    return new SuccessResponse('users listed successfully', result, meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('users:read@auth')
  @Validator(GetUserValidator)
  @Serializer(GetUserResponse)
  @OtelMethodCounter()
  public async get(
    @Param() params: GetUserParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.userService.get(params);

    return new SuccessResponse('User fetch Successfully', result);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('user:update@auth')
  @Validator(UpdateUserValidator)
  @Serializer(UpdateUserResponse)
  @OtelMethodCounter()
  public async update(
    @Context() ctx: IContext,
    @Param() params: UpdateUserParamsValidator,
    @Body() body: UpdateUserBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.userService.update(ctx, body, params);

    return new SuccessResponse('user fetched successfully', result);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('users:create@auth')
  @Validator(CreateUserValidator)
  @Serializer(GetUserResponse)
  @OtelMethodCounter()
  public async create(
    @Context() ctx: IContext,
    @User() user: TUserCustomInformation,
    @Body() body: CreateUserBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.userService.create(ctx, user, body);

    return new SuccessResponse('user created successfully', result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('users:delete@auth')
  @Validator(DeleteUserValidator)
  @Serializer(DeleteUserResponse)
  @OtelMethodCounter()
  public async delete(
    @Context() ctx: IContext,
    @Param() params: DeleteUserParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.userService.delete(ctx, params);

    return new SuccessResponse('user deleted successfully', result);
  }
}
