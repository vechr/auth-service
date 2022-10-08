import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Session } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
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

    const jwt = await generateJwt({
      origin: ctx.headers?.['origin'] || 'http://localhost',
      userId: user.id,
      siteCode: user.site.code,
    });

    const customUser = transformUserToCustomInformation(user);
    return { user: customUser, jwt };
  }
}
