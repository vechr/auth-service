import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import UserService from './user.service';
import GetUserResponse from './serializers/get-user.response';
import GetUserValidator, {
  GetUserParamsValidator,
} from './validators/get-user.validator';
import ListUserValidator, {
  ListUserQueryValidator,
} from './validators/list-topic-event.validator';
import ListUserResponse from './serializers/list-user.response';
import SuccessResponse from '@/shared/responses/success.response';
import Authorization from '@/shared/decorators/authorization.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';
import UseList from '@/shared/decorators/uselist.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('auth/users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('users:read@auth')
  @UseList()
  @Validator(ListUserValidator)
  @Serializer(ListUserResponse)
  @ApiFilterQuery('filters', ListUserQueryValidator)
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
  public async get(
    @Param() params: GetUserParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.userService.get(params);

    return new SuccessResponse('User fetch Successfully', result);
  }
}
