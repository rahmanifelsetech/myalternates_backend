import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SignInWithPasswordSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export class SignInWithPasswordDto extends createZodDto(SignInWithPasswordSchema) {}