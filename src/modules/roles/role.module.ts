import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import appConfig from '@/config/app.config';
import { RoleController } from './infrastructure/role.controller';
import { RoleUseCase } from './domain/usecase/role.usecase';
import { RoleRepository } from './data/role.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

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
  controllers: [RoleController],
  providers: [RoleUseCase, RoleRepository, PrismaService],
  exports: [RoleRepository],
})
export default class RoleModule {}
