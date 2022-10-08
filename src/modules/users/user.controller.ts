import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import UserService from './user.service';
import GetUserResponse from './serializers/get-user.response';
import GetUserValidator from './validators/get-user.validator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import SuccessResponse from '@/shared/responses/success.response';
import Authorization from '@/shared/decorators/authorization.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('users:read@auth')
  @Validator(GetUserValidator)
  @Serializer(GetUserResponse)
  public async get(@Context() ctx: IContext): Promise<SuccessResponse> {
    const result = await this.userService.get(ctx);

    return new SuccessResponse('User fetch Successfully', result);
  }
}
