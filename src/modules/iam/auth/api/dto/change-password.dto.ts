import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}