import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config/config.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfigService } from '@app/config/services/throttler-config.service';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '@app/infrastructure/database/database.module';
import { UsersModule } from './modules/iam/users/users.module';
import { AuthModule } from './modules/iam/auth/auth.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/guards/permissions.guard';
import { RolesModule } from './modules/iam/roles/roles.module';
import { PermissionsModule } from './modules/iam/permissions/permissions.module';
import { ProductsModule } from './modules/products/products.module';
import { MastersModule } from './modules/masters/masters.module';
import { DataUploadModule } from './modules/data-upload/data-upload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FileUploadModule } from './shared/modules/file-upload/file-upload.module';
import { AmcModule } from './modules/amc/amc.module';
import { SchemesModule } from './modules/schemes/schemes.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ProductsModule,
    MastersModule,
    DataUploadModule,
    NotificationsModule,
    FileUploadModule,
    AmcModule,
    SchemesModule,
  ],
  controllers: [
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
