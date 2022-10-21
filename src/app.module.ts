import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import UserModule from './modules/users/user.module';
import AuthModule from './core/auth.module';
import { SessionModule } from './modules/sessions/session.module';
import PermissionModule from './modules/permissions/permission.module';
import SiteModule from './modules/sites/site.module';
import RoleModule from './modules/roles/role.module';
import AuditAuthModule from './modules/audits/audit.module';
import { logger } from '@/shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),

    PrismaModule,
    AuthModule,

    AuditAuthModule,
    SessionModule,
    UserModule,
    PermissionModule,
    SiteModule,
    RoleModule,
  ],
})
export default class HttpModule {}
