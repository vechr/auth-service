import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import UserService from './user.service';
import GetUserResponse from './serializers/get-user.response';
import GetUserValidator, {
  GetUserParamsValidator,
} from './validators/get-user.validator';
import SuccessResponse from '@/shared/responses/success.response';
import Authorization from '@/shared/decorators/authorization.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('auth/users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

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
