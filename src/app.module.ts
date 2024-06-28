import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { TerminusModule } from '@nestjs/terminus';
import { WinstonModule } from 'nest-winston';
import { winstonModuleOptions } from '@utils/log.util';
import { PrismaModule } from './core/base/frameworks/data-services/prisma.module';
import UserModule from './modules/users/user.module';
import AuthModule from './core/base/frameworks/auth/auth.module';
import { SessionModule } from './modules/sessions/session.module';
import PermissionModule from './modules/permissions/permission.module';
import SiteModule from './modules/sites/site.module';
import RoleModule from './modules/roles/role.module';
import AuditAuthModule from './modules/audits/audit.module';
import { InstrumentMiddleware } from './core/base/frameworks/shared/middlewares/instrument.middleware';
import HealthModule from './modules/health/health.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

const WinstonLoggerModule = WinstonModule.forRootAsync({
  useFactory: () => winstonModuleOptions,
});

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    WinstonLoggerModule,

    PrismaModule,
    AuthModule,

    AuditAuthModule,
    SessionModule,
    UserModule,
    PermissionModule,
    SiteModule,
    RoleModule,
    TerminusModule,
    HealthModule,
  ],
})
export default class HttpModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(InstrumentMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
