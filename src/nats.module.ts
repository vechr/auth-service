import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import UserModule from './modules/users/user.module';
import AuthModule from './core/auth.module';
import { logger } from '@/shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),

    PrismaModule,
    AuthModule,
    UserModule,
  ],
})
export default class NatsModule {}
