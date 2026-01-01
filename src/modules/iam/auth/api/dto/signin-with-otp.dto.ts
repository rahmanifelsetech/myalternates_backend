import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SignInWithOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  rememberMe: z.boolean().optional().default(false),
});

export class SignInWithOtpDto extends createZodDto(SignInWithOtpSchema) {}