import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import UserModule from './modules/users/user.module';
import AuthModule from './core/auth.module';
import { SessionModule } from './modules/sessions/session.module';
import PermissionModule from './modules/permissions/permission.module';
import SiteModule from './modules/sites/site.module';
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
    PermissionModule,
    SiteModule,
  ],
})
export default class HttpModule {}
