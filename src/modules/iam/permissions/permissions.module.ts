import { Module } from '@nestjs/common';
import { PermissionsService } from './application/permissions.service';
import { PermissionsRepository } from './infrastructure/permissions.repository';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { PermissionsController } from './api/permissions.controller';
import { DatabaseModule } from '@app/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    {
      provide: PERMISSIONS_REPOSITORY_TOKEN,
      useClass: PermissionsRepository,
    },
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
