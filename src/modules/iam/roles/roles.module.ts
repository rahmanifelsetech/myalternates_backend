import { Module } from '@nestjs/common';
import { RolesService } from './application/roles.service';
import { RolesRepository } from './infrastructure/roles.repository';
import { ROLES_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { RolesController } from './api/roles.controller';
import { DatabaseModule } from '@app/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: ROLES_REPOSITORY_TOKEN,
      useClass: RolesRepository,
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
