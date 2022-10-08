import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import UserModule from './modules/users/user.module';
import AuthModule from './core/auth.module';
import { SessionModule } from './modules/sessions/session.module';
import { logger } from '@/shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),

    PrismaModule,
    AuthModule,

    SessionModule,
    UserModule,
  ],
})
export default class HttpModule {}
