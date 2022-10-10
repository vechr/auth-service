import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditAuthService from '../audits/audit.service';
import RoleController from './role.contoller';
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
        },
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, AuditAuthService],
})
export default class RoleModule {}
