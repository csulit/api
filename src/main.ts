import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import * as xss from 'xss-clean';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './common/serializer/exception/http.exception';
import { PrismaExceptionFilter } from './common/serializer/exception/prisma.exception';
import { PrismaClientService } from './prisma-client/prisma-client.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // No need? if enabled CORS policy in DigitalOcean?
  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
  });

  app.use(
    hpp({
      whitelist: [],
    }),
  );

  app.use(cookieParser());
  app.use(helmet());
  app.use(xss());
  app.use(compression());

  const prismaClientService: PrismaClientService = app.get(PrismaClientService);

  prismaClientService.enableShutdownHooks(app);

  const options = new DocumentBuilder()
    .addBasicAuth()
    .addCookieAuth()
    .setVersion('1.0.0')
    .setTitle('HDF API Documentation')
    .setDescription('A very nice description')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const redocOptions: RedocOptions = {
    title: 'HDF API DOCS',
    logo: {
      url: 'https://kmcstorage1.blob.core.windows.net/project-statics/kmc-logo-black-with-text.png',
      backgroundColor: '#F0F0F0',
      altText: 'KMC Solutions logo',
    },
    sortPropsAlphabetically: false,
    hideDownloadButton: true,
    hideHostname: false,
    tagGroups: [
      {
        name: 'Core resources',
        tags: ['Authentication'],
      },
    ],
  };

  // Instead of using SwaggerModule.setup() you call this module
  await RedocModule.setup('/docs', app, document, redocOptions);

  await app.listen(4001);
}
bootstrap();
