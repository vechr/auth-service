import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import SessionService from './session.service';
import { CreateSessionBodyValidator } from './validators/create-session.validator';
import CreateSessionResponse from './serializers/create-session.response';
import RefreshSessionResponse from './serializers/refresh-session.response';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import User from '@/core/base/frameworks/shared/decorators/user.decorator';
import { TUserCustomInformation } from '@/core/base/frameworks/shared/types/user.type';
import CookieAuthentication from '@/core/base/frameworks/shared/decorators/cookie-auth.decorator';
@ApiTags('Session')
@Controller('auth/sessions')
@OtelInstanceCounter()
export default class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiBearerAuth('access-token')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @OtelMethodCounter()
  public async getMe(@User() user: TUserCustomInformation): Promise<SuccessResponse> {
    return new SuccessResponse('success get information!', user);
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @CookieAuthentication('logout')
  @OtelMethodCounter()
  public async logout(@User() user: TUserCustomInformation): Promise<SuccessResponse> {
    if (user.id) await this.sessionService.logout(user.id);
    return new SuccessResponse('logout success!', true);
  }

  @ApiBearerAuth('access-token')
  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @OtelMethodCounter()
  public async pingAuth(): Promise<SuccessResponse> {
    return new SuccessResponse('token status ok!', true);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreateSessionResponse)
  @CookieAuthentication('login')
  @OtelMethodCounter()
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
  @OtelMethodCounter()
  public async refresh(@Context() ctx: IContext): Promise<SuccessResponse> {
    const result = await this.sessionService.refresh(ctx);

    return new SuccessResponse('token refreshed successfully', result);
  }
}
