import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import SessionService from './session.service';
import CreateSessionValidator, {
  CreateSessionBodyValidator,
} from './validators/create-session.validator';
import CreateSessionResponse from './serializers/create-session.response';
import RefreshSessionValidator, {
  RefreshSessionParamsValidator,
} from './validators/refresh-session.validator';
import RefreshSessionResponse from './serializers/refresh-session.response';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import SuccessResponse from '@/shared/responses/success.response';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';
import { generateExpiredDate } from '@/shared/utils/jwt.util';
@ApiTags('Session')
@Controller('auth/sessions')
export default class SessionController {
  constructor(private readonly sessionService: SessionService) {}

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
  public async create(
    @Res({ passthrough: true }) response: any,
    @Context() ctx: IContext,
    @Body() body: CreateSessionBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this.sessionService.create(ctx, {
      username: body.username,
      password: body.password,
    });

    response.cookie('access-token', result.token, {
      expires: generateExpiredDate(),
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
    });

    return new SuccessResponse('login success', result);
  }

  @ApiBearerAuth('access-token')
  @Post('refresh/:refresh')
  @HttpCode(HttpStatus.ACCEPTED)
  @Authentication(true)
  @Validator(RefreshSessionValidator)
  @Serializer(RefreshSessionResponse)
  public async refresh(
    @Context() ctx: IContext,
    @Param() params: RefreshSessionParamsValidator,
  ): Promise<SuccessResponse> {
    const result = await this.sessionService.refresh(ctx, params.refresh);

    return new SuccessResponse('token refreshed successfully', result);
  }
}
