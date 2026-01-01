import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';

// DTOs (Internal for now, but could be moved to separate files if module grows)
class SendEmailDto {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

class SendPushDto {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('email')
  @ApiOperation({ summary: 'Send an email notification' })
  // Add permission decorator here if needed, e.g. @Permissions(PERMISSIONS.NOTIFICATIONS.SEND_EMAIL)
  async sendEmail(@Body() dto: SendEmailDto) {
    return this.notificationsService.sendEmail(dto.to, dto.subject, dto.text, dto.html);
  }

  @Post('push')
  @ApiOperation({ summary: 'Send a push notification' })
  // Add permission decorator here if needed
  async sendPush(@Body() dto: SendPushDto) {
    return this.notificationsService.sendPushNotification(dto.token, dto.title, dto.body, dto.data);
  }
}