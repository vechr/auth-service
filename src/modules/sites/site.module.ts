import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import appConfig from '@/config/app.config';
import { SiteController } from './infrastructure/site.controller';
import { SiteUseCase } from './domain/usecase/site.usecase';
import { SiteRepository } from './data/site.repository';
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
  controllers: [SiteController],
  providers: [SiteRepository, SiteUseCase, PrismaService],
  exports: [SiteRepository],
})
export default class SiteModule {}
