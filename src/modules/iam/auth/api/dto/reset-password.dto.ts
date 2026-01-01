import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ResetPasswordSchema = z.object({
  reset_token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'New password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}