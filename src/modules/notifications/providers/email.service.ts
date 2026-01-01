import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('notification.email.host');
    const port = this.configService.get<number>('notification.email.port');
    const secure = this.configService.get<boolean>('notification.email.secure');
    const user = this.configService.get<string>('notification.email.user');
    const pass = this.configService.get<string>('notification.email.pass');

    if (!host || !port) {
      this.logger.warn('Email configuration missing. Email service disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    if (!this.transporter) {
      this.logger.warn('Email transporter not initialized. Skipping email.');
      return;
    }

    const from = this.configService.get<string>('notification.email.from');

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`, error.stack);
      throw error;
    }
  }
}