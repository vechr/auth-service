import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import AuditAuthService from '../audits/audit.service';
import UserController from './user.controller';
import UserNatsController from './user.nats';
import UserService from './user.service';
import appConfig from '@/config/app.config';
import PrismaService from '@/core/base/frameworks/data-services/prisma.service';

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
  controllers: [UserController, UserNatsController],
  providers: [UserService, PrismaService, AuditAuthService],
})
export default class UserModule {}
