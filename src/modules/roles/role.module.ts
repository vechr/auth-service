import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditAuthService from '../audits/audit.service';
import RoleController from './role.controller';
import RoleService from './role.service';
import appConstant from '@/constants/app.constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: appConstant.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
          maxReconnectAttempts: 10,
          tls: {
            caFile: appConstant.NATS_CA,
            keyFile: appConstant.NATS_KEY,
            certFile: appConstant.NATS_CERT,
          },
        },
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, AuditAuthService],
})
export default class RoleModule {}
