import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import UserController from './user.controller';
import UserNatsController from './user.nats';
import UserService from './user.service';
import appConstant from '@/constants/app.constant';
import PrismaService from '@/prisma/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      { name: appConstant.NATS_SERVICE, transport: Transport.NATS },
    ]),
  ],
  controllers: [UserController, UserNatsController],
  providers: [UserService, PrismaService],
})
export default class UserModule {}
