export interface OtpEmailParams {
  otp: string;
}

export const getOtpEmailTemplate = (params: OtpEmailParams) => {
  const { otp } = params;
  return `
    <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
  `;
};