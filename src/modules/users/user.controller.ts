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
import { GetUserParamsValidator } from './validators/get-user.validator';
import { ListUserQueryValidator } from './validators/list-user.validator';
import ListUserResponse from './serializers/list-user.response';
import { CreateUserBodyValidator } from './validators/create-user.validator';
import {
  UpdateUserBodyValidator,
  UpdateUserParamsValidator,
} from './validators/update-user.validator';
import UpdateUserResponse from './serializers/update-user.response';
import { DeleteUserParamsValidator } from './validators/delete-user.validator';
import DeleteUserResponse from './serializers/delete-user.response';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import UseList from '@/core/base/frameworks/shared/decorators/uselist.decorator';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import { ApiFilterQuery } from '@/core/base/frameworks/shared/decorators/api-filter-query.decorator';
import User from '@/core/base/frameworks/shared/decorators/user.decorator';
import { TUserCustomInformation } from '@/core/base/frameworks/shared/types/user.type';

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
  @Serializer(GetUserResponse)
  @OtelMethodCounter()
  public async get(@Param() params: GetUserParamsValidator): Promise<SuccessResponse> {
    const result = await this.userService.get(params);

    return new SuccessResponse('User fetch Successfully', result);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('user:update@auth')
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
