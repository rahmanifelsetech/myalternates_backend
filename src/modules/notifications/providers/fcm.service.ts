import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const projectId = this.configService.get<string>('notification.fcm.projectId');
    const clientEmail = this.configService.get<string>('notification.fcm.clientEmail');
    const privateKey = this.configService.get<string>('notification.fcm.privateKey');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('FCM configuration missing. FCM service disabled.');
      return;
    }

    try {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      this.logger.log('Firebase Admin initialized successfully');
    } catch (error) {
      this.logger.error(`Error initializing Firebase Admin: ${error.message}`, error.stack);
    }
  }

  async sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>) {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase App not initialized. Skipping push notification.');
      return;
    }

    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title,
          body,
        },
        data,
      };

      const response = await this.firebaseApp.messaging().send(message);
      this.logger.log(`Push notification sent: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`, error.stack);
      throw error;
    }
  }
}