import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import AuditAuthService from '../audits/audit.service';
import UserController from './user.controller';
import UserNatsController from './user.nats';
import UserService from './user.service';
import appConstant from '@/constants/app.constant';
import PrismaService from '@/prisma/prisma.service';

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
  controllers: [UserController, UserNatsController],
  providers: [UserService, PrismaService, AuditAuthService],
})
export default class UserModule {}
