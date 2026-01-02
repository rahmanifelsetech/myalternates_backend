import { getBaseEmailTemplate } from './base.template';

export interface InternalWelcomeEmailParams {
  name: string;
  email: string;
  password: string;
}

export const getInternalWelcomeEmailTemplate = (params: InternalWelcomeEmailParams) => {
  const { name, email, password } = params;
  const content = `
    <p>Hello ${name},</p>
    <p>An account has been created for you. Here are your login credentials:</p>
    <div style="background-color: #eee; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
    </div>
    <p>Please log in and change your password immediately.</p>
  `;
  return getBaseEmailTemplate({ content, headerText: `
    <h1 style="color: #333;">Welcome to MyAlternates!</h1>
  `});
};