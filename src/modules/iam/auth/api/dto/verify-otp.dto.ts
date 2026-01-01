import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VerifyOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}