import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import UserModule from './modules/users/user.module';
import AuditAuthModule from './modules/audits/audit.module';
import { logger } from '@/shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),

    PrismaModule,
    AuditAuthModule,
    UserModule,
  ],
})
export default class NatsModule {}
