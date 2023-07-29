import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { OpenTelemetryModule } from 'nestjs-otel';
import { PrismaModule } from './prisma/prisma.module';
import UserModule from './modules/users/user.module';
import AuthModule from './core/auth.module';
import { SessionModule } from './modules/sessions/session.module';
import PermissionModule from './modules/permissions/permission.module';
import SiteModule from './modules/sites/site.module';
import RoleModule from './modules/roles/role.module';
import AuditAuthModule from './modules/audits/audit.module';
import { InstrumentMiddleware } from './shared/middlewares/instrument.middleware';
import { logger } from '@/shared/utils/log.util';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

const PinoLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    customLogLevel: function (_, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'error';
      } else if (res.statusCode >= 500 || err) {
        return 'fatal';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'warn';
      } else if (res.statusCode >= 200 && res.statusCode < 300) {
        return 'info';
      }
      return 'debug';
    },
    logger,
  },
});
@Module({
  imports: [
    OpenTelemetryModuleConfig,
    PinoLoggerModule,

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
export default class HttpModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InstrumentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
