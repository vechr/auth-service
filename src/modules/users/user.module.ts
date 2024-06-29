import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import UserNatsController from './infrastructure/user-nats.controller';
import appConfig from '@/config/app.config';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { UserController } from './infrastructure/user.controller';
import { UserRepository } from './data/user.repository';
import { UserUseCase } from './domain/usecase/user.usecase';

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
  providers: [PrismaService, UserUseCase, UserRepository],
  exports: [UserRepository],
})
export default class UserModule {}
