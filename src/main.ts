import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from '@app/shared/filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { swaggerHelpers } from '@app/config/configurations/swagger.config';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import winstonOptions from '@app/config/configurations/winston.config';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions()),
  });
  const configService = app.get(ConfigService);

  // ========================
  // App config
  // ========================
  const port = configService.get<number>('app.port', { infer: true }) as number;
  const apiVersion = configService.get<string>('app.apiVersion', {
    infer: true,
  }) as string;
  const isProduction = configService.get<boolean>('app.isProduction', {
    infer: true,
  }) as boolean;

  // ========================
  // CORS config
  // ========================
  const allowedOrigins = configService.get<string | string[]>(
    'app.allowedOrigins',
    {
      infer: true,
    },
  ) as string | string[];

  // ========================
  // Swagger config
  // ========================
  const swaggerEnabled = configService.get<boolean>('swagger.enabled', {
    infer: true,
  }) as boolean;

  if (swaggerEnabled) {
    const swaggerConfig = swaggerHelpers.createConfig(
      configService,
    ) as OpenAPIObject;
    const swaggerPath = swaggerHelpers.getPath(configService);
    const swaggerDocs = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, swaggerDocs);
    console.log(
      `[Nest] Swagger docs available at http://localhost:${port}/${swaggerPath}`,
    );
  }

  app.enableCors({
    origin: allowedOrigins,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
    prefix: 'v',
  });
  app.setGlobalPrefix('/api');
  
  app.useStaticAssets(join(process.cwd(), 'storage'), {
    prefix: '/storage',
  });

  app.useGlobalPipes(new ZodValidationPipe());

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
  );

  await app.listen(port);
  console.log(`[Nest] App running on http://localhost:${port}`);
}

void bootstrap();
