import { Module } from '@nestjs/common';
import { UsersRepository } from './infrastructure/users.repository';
import { DatabaseModule } from '@app/infrastructure/database/database.module';
import { UsersService } from './application/users.service';
import { UsersController } from './api/users.controller';
import { USERS_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { NotificationsModule } from '@app/modules/notifications/notifications.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService, USERS_REPOSITORY_TOKEN],
})
export class UsersModule {}
