import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import log from '@shared/utils/log.util';
import HttpExceptionFilter from '@shared/filters/http.filter';
import UnknownExceptionsFilter from '@shared/filters/unknown.filter';

import { VersioningType } from '@nestjs/common';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import HttpModule from './http.module';
import appConstant from './constants/app.constant';
import ContextInterceptor from './shared/interceptors/context.interceptor';
import NatsModule from '@/nats.module';

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);

    app.enableCors();
    app.useGlobalFilters(
      new UnknownExceptionsFilter(),
      new HttpExceptionFilter(),
    );
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });
    app.useGlobalInterceptors(new ContextInterceptor());
    app.use(
      '/api/auth/public',
      express.static(join(__dirname, '../../', 'public')),
    );
    const option = {
      customCss: `
      .topbar-wrapper img {content:url('/api/auth/public/logo.svg'); width:200px; height:auto;}
      .swagger-ui .topbar { background: linear-gradient(45deg, rgba(0,209,255,1) 42%, rgba(0,217,139,1) 100%); }`,
      customfavIcon: `/api/auth/public/logo.svg`,
      customSiteTitle: 'Vechr API Auth Services',
    };
    const config = new DocumentBuilder()
      .setTitle('Auth Service API Documentation')
      .setDescription('This is a Auth Service for creating Metadata IoT system')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          description: `[just text field] Please enter token in following format: Bearer <JWT>`,
          name: 'Authorization',
          bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
          scheme: 'Bearer',
          type: 'http', // I`ve attempted type: 'apiKey' too
          in: 'Header',
        },
        'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/auth', app, document, option);

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
