import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './providers/email.service';
import { FcmService } from './providers/fcm.service';
import { EmailTemplates, EmailTemplateType, EmailTemplateParamsMap } from './templates/email-templates.registry';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly fcmService: FcmService,
  ) {}

  /**
   * Send an email notification
   * @param to Recipient email address
   * @param subject Email subject
   * @param text Plain text content
   * @param html Optional HTML content
   */
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    return this.emailService.sendEmail(to, subject, text, html);
  }

  /**
   * Send a push notification via FCM
   * @param token FCM device token
   * @param title Notification title
   * @param body Notification body
   * @param data Optional data payload
   */
  async sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>) {
    return this.fcmService.sendPushNotification(token, title, body, data);
  }

  /**
   * Send both email and push notification
   * @param emailOptions Email options
   * @param pushOptions Push notification options
   */
  async sendMultichannelNotification(
    emailOptions: { to: string; subject: string; text: string; html?: string },
    pushOptions: { token: string; title: string; body: string; data?: Record<string, string> },
  ) {
    const promises: Promise<any>[] = [];
    if (emailOptions) {
      promises.push(this.sendEmail(emailOptions.to, emailOptions.subject, emailOptions.text, emailOptions.html));
    }
    if (pushOptions) {
      promises.push(this.sendPushNotification(pushOptions.token, pushOptions.title, pushOptions.body, pushOptions.data));
    }
    return Promise.allSettled(promises);
  }

  /**
   * Send an email using a predefined template
   * @param to Recipient email address
   * @param templateType The type of email template to use
   * @param params Parameters required by the template
   */
  async sendEmailWithTemplate<T extends EmailTemplateType>(
    to: string,
    templateType: T,
    params: EmailTemplateParamsMap[T],
  ) {
    const templateConfig = EmailTemplates[templateType];
    if (!templateConfig) {
      this.logger.error(`Template type ${templateType} not found`);
      throw new Error(`Template type ${templateType} not found`);
    }

    const html = (templateConfig.template as any)(params);
    const subject = templateConfig.subject;
    // We can generate a simple text version from HTML or require a text template as well.
    // For now, using a generic text fallback.
    const text = `Please view this email in a generic HTML compatible viewer.`;

    return this.sendEmail(to, subject, text, html);
  }
}