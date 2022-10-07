import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import appConstant from './constants/app.constant';
import HttpModule from './http.module';
import NatsModule from './nats.module';
import HttpExceptionFilter from './shared/filters/http.filter';
import UnknownExceptionFilter from './shared/filters/unknown.filter';
import ContextInterceptor from './shared/interceptors/context.interceptor';
import log from './shared/utils/log.util';

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);
    app.enableCors();
    app.useGlobalFilters(
      new UnknownExceptionFilter(),
      new HttpExceptionFilter(),
    );
    app.useGlobalInterceptors(new ContextInterceptor());

    await app
      .listen(appConstant.APP_PORT)
      .then(() => log.info(`http server started at :${appConstant.APP_PORT}`));

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

const natsServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      NatsModule,
      {
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
        },
      },
    );

    await app
      .listen()
      .then(() => log.info(`Nest nats started at: ${appConstant.NATS_URL}`));

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  await Promise.all([httpServer, natsServer]);
})();
