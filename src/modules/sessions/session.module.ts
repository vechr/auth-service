import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import UserService from '../users/user.service';
import SessionController from './session.controller';
import SessionService from './session.service';
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
  controllers: [SessionController],
  providers: [SessionService, UserService],
})
export class SessionModule {}
