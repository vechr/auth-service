import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import log from '@shared/utils/log.util';
import HttpExceptionFilter from '@shared/filters/http.filter';
import UnknownExceptionsFilter from '@shared/filters/unknown.filter';
import { VersioningType } from '@nestjs/common';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import otelSDK from './tracing';
import HttpModule from './app.module';
import appConstant from './constants/app.constant';
import ContextInterceptor from './shared/interceptors/context.interceptor';

const appServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);

    // Connect to Broker NATS
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [appConstant.NATS_URL],
        maxReconnectAttempts: 10,
        tls: {
          caFile: appConstant.NATS_CA,
          keyFile: appConstant.NATS_KEY,
          certFile: appConstant.NATS_CERT,
        },
      },
    });
    await app
      .startAllMicroservices()
      .then(() =>
        log.info(`Nest app NATS started at :${appConstant.NATS_URL} `),
      );

    // Set prefix api globally
    app.setGlobalPrefix('api', { exclude: ['health', '/'] });

    // Enable CORS for security
    app.enableCors({
      credentials: true,
      origin: true,
    });

    // Use Exception Filter
    app.useGlobalFilters(
      new UnknownExceptionsFilter(),
      new HttpExceptionFilter(),
    );

    // Versioning of default URL V1
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });

    // Use Global Interceptors
    app.useGlobalInterceptors(new ContextInterceptor());

    // Serve public images
    app.use(
      '/api/auth/public',
      express.static(join(__dirname, '../../', 'public')),
    );

    // Use Cookie for http only
    app.use(cookieParser());
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
      .then(() =>
        log.info(`Nest app http started at PORT: ${appConstant.APP_PORT}`),
      );

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  if (appConstant.OTLP_HTTP_URL && appConstant.OTLP_HTTP_URL != '')
    otelSDK.start();
  await Promise.all([appServer]);
})();
