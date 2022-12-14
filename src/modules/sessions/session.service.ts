import {
  HttpStatus,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Session } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import dayjs from 'dayjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import sessionException from './session.exception';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import {
  TUserCustomInformation,
  TUserFullInformation,
} from '@/shared/types/user.type';
import { generateJwt, IGeneratedJwt } from '@/shared/utils/jwt.util';
import { requestReply } from '@/shared/utils/nats.util';
import { checkPassword } from '@/shared/utils/password.util';
import { transformUserToCustomInformation } from '@/shared/utils/user.util';
import log from '@/shared/utils/log.util';
import { UnknownException } from '@/shared/exceptions/common.exception';

type TCreate = {
  username: string;
  password: string;
};

type TLogin = {
  username: string;
  password: string;
};

type TDataLogin = {
  user: TUserCustomInformation;
  jwt: IGeneratedJwt;
};

@Injectable()
export default class SessionService implements OnApplicationBootstrap {
  constructor(
    private readonly db: PrismaService,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  public async onApplicationBootstrap() {
    await this.client.connect();
  }

  public async logout(userId: string): Promise<void> {
    try {
      await this.db.session.deleteMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  public async create(
    ctx: IContext,
    { username, password }: TCreate,
  ): Promise<Session> {
    const headers = Object.assign({}, ctx.headers);

    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    const { user, jwt } = await this.login(ctx, { username, password });

    const session = await this.db.session.create({
      data: {
        userId: user.id,
        token: jwt.token,
        refresh: jwt.refresh,
        data: { user: instanceToPlain(user), headers },
        expiredAt: jwt.expired,
      },
    });

    return session;
  }

  public async refresh(ctx: IContext): Promise<Session> {
    const refreshToken = ctx.refreshToken;
    if (refreshToken === undefined)
      throw new sessionException.RefreshTokenNotFound();

    const user = ctx.user as TUserCustomInformation;
    const headers = Object.assign({}, ctx.headers);

    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    const currentSession = await this.db.session.findUnique({
      where: {
        refresh: refreshToken,
      },
    });

    if (!currentSession) {
      throw new sessionException.InvalidRefreshToken();
    }

    if (dayjs().isAfter(currentSession.expiredAt)) {
      throw new sessionException.RefreshTokenExpired({
        expiredAt: dayjs(currentSession.expiredAt).format(),
      });
    }

    const jwt = await generateJwt({
      origin: ctx.headers?.['origin'] || 'http://localhost',
      userId: currentSession.userId,
      siteCode: user.siteCode,
      user,
    });

    const session = await this.db.session.update({
      where: {
        refresh: refreshToken,
      },
      data: {
        userId: currentSession.userId,
        token: jwt.token,
        refresh: jwt.refresh,
        data: { user: instanceToPlain(user), headers },
        expiredAt: jwt.expired,
      },
    });

    return session;
  }

  private async login(
    ctx: IContext,
    { username, password }: TLogin,
  ): Promise<TDataLogin> {
    const user = await requestReply<TUserFullInformation>(
      this.client,
      'auth.user.findCompleteByUsername',
      { username },
    );

    if (!user) {
      throw new sessionException.UserNotFound({ username });
    }

    const isMatch = await checkPassword(password, user.password);

    if (!isMatch) {
      throw new sessionException.WrongPassword();
    }

    const customUser = transformUserToCustomInformation(user);

    const jwt = await generateJwt({
      origin: ctx.headers?.['origin'] || 'http://localhost',
      userId: user.id,
      siteCode: user.site.code,
      user: customUser,
    });

    return { user: customUser, jwt };
  }
}
