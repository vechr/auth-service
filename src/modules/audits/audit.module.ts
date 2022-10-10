import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditAuthNatsController from './audit.nats';
import AuditAuthService from './audit.service';
import AuditAuthController from './audit.controller';
import appConstant from '@/constants/app.constant';

@Global()
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
  controllers: [AuditAuthNatsController, AuditAuthController],
  providers: [AuditAuthService],
  exports: [AuditAuthService],
})
export default class AuditAuthModule {}
