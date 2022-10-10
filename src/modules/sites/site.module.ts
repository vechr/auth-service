import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import AuditAuthService from '../audits/audit.service';
import SiteController from './site.controller';
import SiteService from './site.service';
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
  controllers: [SiteController],
  providers: [SiteService, AuditAuthService],
})
export default class SiteModule {}
