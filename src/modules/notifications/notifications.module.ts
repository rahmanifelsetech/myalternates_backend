import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './providers/email.service';
import { FcmService } from './providers/fcm.service';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './api/notifications.controller';

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [EmailService, FcmService, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}