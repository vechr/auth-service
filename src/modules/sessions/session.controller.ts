import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ICreateSessionRequestBody } from './requests/create-session.request';
import SessionService from './session.service';
import CreateSessionValidator from './validators/create-session.validator';
import CreateSessionResponse from './serializers/create-session.response';
import { IRefreshSessionRequestParams } from './requests/refresh-session.request';
import RefreshSessionValidator from './validators/refresh-session.validator';
import RefreshSessionResponse from './serializers/refresh-session.response';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import SuccessResponse from '@/shared/responses/success.response';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Authentication from '@/shared/decorators/authentication.decorator';

@Controller('sessions')
export default class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Validator(CreateSessionValidator)
  @Serializer(CreateSessionResponse)
  public async create(
    @Context() ctx: IContext,
    @Body() body: ICreateSessionRequestBody,
  ): Promise<SuccessResponse> {
    const result = await this.sessionService.create(ctx, {
      username: body.username,
      password: body.password,
    });

    return new SuccessResponse('login success', result);
  }

  @Post('refresh/:refresh')
  @HttpCode(HttpStatus.ACCEPTED)
  @Authentication(true)
  @Validator(RefreshSessionValidator)
  @Serializer(RefreshSessionResponse)
  public async refresh(
    @Context() ctx: IContext,
    @Param() params: IRefreshSessionRequestParams,
  ): Promise<SuccessResponse> {
    const result = await this.sessionService.refresh(ctx, params.refresh);

    return new SuccessResponse('token refreshed successfully', result);
  }
}
