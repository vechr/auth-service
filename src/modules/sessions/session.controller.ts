import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import SessionService from './session.service';
import CreateSessionValidator, {
  CreateSessionBodyValidator,
} from './validators/create-session.validator';
import CreateSessionResponse from './serializers/create-session.response';
import RefreshSessionResponse from './serializers/refresh-session.response';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import SuccessResponse from '@/shared/responses/success.response';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';
import User from '@/shared/decorators/user.decorator';
import { TUserCustomInformation } from '@/shared/types/user.type';
import CookieAuthentication from '@/shared/decorators/cookie-auth.decorator';
@ApiTags('Session')
@Controller('auth/sessions')
export default class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @CookieAuthentication('logout')
  public async logout(
    @User() user: TUserCustomInformation,
  ): Promise<SuccessResponse> {
    if (user.id) await this.sessionService.logout(user.id);
    return new SuccessResponse('logout success!', true);
  }

  @ApiBearerAuth('access-token')
  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  public async pingAuth(): Promise<SuccessResponse> {
    return new SuccessResponse('token status ok!', true);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Validator(CreateSessionValidator)
  @Serializer(CreateSessionResponse)
  @CookieAuthentication('login')
  public async create(
    @Context() ctx: IContext,
    @Body() body: CreateSessionBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.sessionService.create(ctx, {
      username: body.username,
      password: body.password,
    });

    return new SuccessResponse('login success', result);
  }

  @ApiBearerAuth('access-token')
  @Post('refresh')
  @HttpCode(HttpStatus.ACCEPTED)
  @Authentication(true)
  @Serializer(RefreshSessionResponse)
  @CookieAuthentication('login')
  public async refresh(@Context() ctx: IContext): Promise<SuccessResponse> {
    const result = await this.sessionService.refresh(ctx);

    return new SuccessResponse('token refreshed successfully', result);
  }
}
