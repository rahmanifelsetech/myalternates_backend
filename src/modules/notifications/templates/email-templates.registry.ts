import { getWelcomeEmailTemplate, WelcomeEmailParams } from './welcome.template';
import { getInternalWelcomeEmailTemplate, InternalWelcomeEmailParams } from './internal-welcome.template';
import { getBaseEmailTemplate } from './base.template';

export enum EmailTemplateType {
  WELCOME = 'WELCOME',
  OTP = 'OTP',
  INTERNAL_WELCOME = 'INTERNAL_WELCOME',
}

export type EmailTemplateParamsMap = {
  [EmailTemplateType.WELCOME]: WelcomeEmailParams;
  [EmailTemplateType.OTP]: { otp: string };
  [EmailTemplateType.INTERNAL_WELCOME]: InternalWelcomeEmailParams;
};

export const EmailTemplates = {
  [EmailTemplateType.WELCOME]: {
    subject: 'Welcome to MyAlternates!',
    template: getWelcomeEmailTemplate,
  },
  [EmailTemplateType.OTP]: {
    subject: 'Your One-Time Password (OTP)',
    template: ({ otp }: { otp: string }) => {
      const content = `
        <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
      `;
      return getBaseEmailTemplate({ content });
    },
  },
  [EmailTemplateType.INTERNAL_WELCOME]: {
    subject: 'Your MyAlternates Account Credentials',
    template: getInternalWelcomeEmailTemplate,
  },
};