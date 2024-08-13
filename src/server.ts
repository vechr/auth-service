import otelSDK from './tracing';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import HttpExceptionFilter from '@filters/http.filter';
import UnknownExceptionsFilter from '@filters/unknown.filter';
import { VersioningType } from '@nestjs/common';
import express from 'express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import ValidationPipe from '@pipes/validation.pipe';
import * as expressWinston from 'express-winston';
import HttpModule from './app.module';
import appConfig from './config/app.config';
import ContextInterceptor from './core/base/frameworks/shared/interceptors/context.interceptor';
import {
  log,
  winstonExpressOptions,
} from './core/base/frameworks/shared/utils/log.util';

const printConfig = () => {
  log.info(`Connected to Redis: ${appConfig.REDIS_URL}`);
  log.info(`Connected to Grafana Loki: ${appConfig.LOKI_HOST}`);
  log.info(`Connected to Grafana Tempo: ${appConfig.OTLP_HTTP_URL}`);
  log.info(
    `Cookie Configuration => Samesite: ${appConfig.COOKIE_SAME_SITE}, Secure: ${
      appConfig.COOKIE_SECURE ? 'yes' : 'no'
    }, HTTP Only: ${appConfig.COOKIE_HTTP_ONLY ? 'yes' : 'no'}`,
  );
  log.info(`Application Name: ${appConfig.APP_NAME}`);
  log.info(`JWT Expiration: ${appConfig.JWT_EXPIRES_IN}`);
  log.info(`Refresh JWT Expiration: ${appConfig.JWT_REFRESH_EXPIRES_IN}`);
};

const appServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);

    // Connect to Broker NATS
    app.connectMicroservice<MicroserviceOptions>({
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
    });

    // Set prefix api globally
    app.setGlobalPrefix('api/auth');

    // Enable CORS for security
    app.enableCors({
      credentials: true,
      origin: true,
    });

    app.useGlobalPipes(new ValidationPipe());

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

    const option: SwaggerCustomOptions = {
      customCss: `
      .topbar-wrapper a {content: url('/api/auth/public/logo.svg'); max-width: 200px !important; height:auto; margin-bottom: 0 !important; margin-top: 0 !important;}
      .topbar-wrapper a svg {display: none;}
      .swagger-ui .topbar {  background: linear-gradient(45deg, rgba(0,209,255,1) 42%, rgba(0,217,139,1) 100%); }`,
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
    SwaggerModule.setup('/api/auth/docs', app, document, option);

    // Ignore Favicon
    app.use(ignoreFavicon);

    const port = process.env.PORT ?? appConfig.APP_PORT;

    // express-winston logger makes sense BEFORE the router
    app.use(expressWinston.logger(winstonExpressOptions));

    await app
      .startAllMicroservices()
      .then(() => log.info(`Nest app NATS started at :${appConfig.NATS_URL} `));

    await app
      .listen(port)
      .then(() => log.info(`Nest app http started at PORT: ${port}`));

    // print config
    printConfig();

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  if (appConfig.OTLP_HTTP_URL && appConfig.OTLP_HTTP_URL != '') otelSDK.start();
  await Promise.all([appServer]);
})();

function ignoreFavicon(req: any, res: any, next: any) {
  if (req.originalUrl.includes('/favicon.ico')) {
    res.status(204).end();
  }
  next();
}
