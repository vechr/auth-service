import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import appConfig from '@/config/app.config';
import AuditUseCase from './domain/usecase/audit.usecase';

@Global()
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
  providers: [AuditUseCase],
  exports: [AuditUseCase],
})
export default class AuditModule {}
