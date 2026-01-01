import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './configurations/app.config';
import swaggerConfig from './configurations/swagger.config';
import { appValidationSchema } from './validation/app.schema';
import { swaggerValidationSchema } from './validation/swagger.schema';
import { databaseValidationSchema } from './validation/database.schema';
import databaseConfig from './configurations/database.config';
import throttlerConfig from './configurations/throttler.config';
import { throttlerValidationSchema } from './validation/throttler.schema';
import winstonConfig from './configurations/winston.config';
import { winstonValidationSchema } from './validation/winston.schema';
import jwtConfig from './configurations/jwt.config';
import { jwtValidationSchema } from './validation/jwt.schema';
import notificationConfig from './configurations/notification.config';
import { notificationConfigSchema } from './validation/notification.schema';
import storageConfig from './configurations/storage.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        swaggerConfig,
        databaseConfig,
        throttlerConfig,
        winstonConfig,
        jwtConfig,
        notificationConfig,
        storageConfig,
      ],
      validationSchema: appValidationSchema
        .concat(swaggerValidationSchema)
        .concat(databaseValidationSchema)
        .concat(throttlerValidationSchema)
        .concat(winstonValidationSchema)
        .concat(jwtValidationSchema)
        .concat(notificationConfigSchema),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      cache: true,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
