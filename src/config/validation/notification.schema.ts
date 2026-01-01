import * as Joi from 'joi';

export const notificationConfigSchema = Joi.object({
  // Email (SMTP) Configuration
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASS: Joi.string().allow('').optional(),
  EMAIL_FROM: Joi.string().required(),

  // Firebase (FCM) Configuration
  FCM_PROJECT_ID: Joi.string().allow('').optional(),
  FCM_CLIENT_EMAIL: Joi.string().allow('').optional(),
  FCM_PRIVATE_KEY: Joi.string().allow('').optional(),
});