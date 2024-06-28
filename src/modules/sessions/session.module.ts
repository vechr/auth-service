import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import UserService from '../users/user.service';
import AuditAuthService from '../audits/audit.service';
import SessionController from './session.controller';
import SessionService from './session.service';
import appConfig from '@/config/app.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: appConfig.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [appConfig.NATS_URL],
          maxReconnectAttempts: 10,
          tls: {
            caFile: appConfig.NATS_CA,
            keyFile: appConfig.NATS_KEY,
            certFile: appConfig.NATS_CERT,
          },
        },
      },
    ]),
  ],
  controllers: [SessionController],
  providers: [SessionService, UserService, AuditAuthService],
})
export class SessionModule {}
