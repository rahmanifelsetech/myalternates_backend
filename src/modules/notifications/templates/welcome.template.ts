import { getBaseEmailTemplate } from './base.template';

export interface WelcomeEmailParams {
  name: string;
}

export const getWelcomeEmailTemplate = (params: WelcomeEmailParams) => {
  const { name } = params;
  const content = `
    <p>Hello ${name},</p>
    <p>We are thrilled to have you on board! Thank you for signing up with MyAlternates.</p>
    <p>We are committed to providing you with the best experience possible.</p>
    <p>If you have any questions, feel free to reply to this email.</p>
  `;
  return getBaseEmailTemplate({ content, header: `
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
      <img src="https://via.placeholder.com/150x50?text=MyAlternates+Logo" alt="MyAlternates Logo" style="max-width: 150px; height: auto;">
      <h1 style="color: #333;">Welcome to MyAlternates!</h1>
    </div>
  ` });
};