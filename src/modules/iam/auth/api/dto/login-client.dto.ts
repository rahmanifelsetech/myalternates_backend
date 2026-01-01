import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginClientSchema = z.object({
  username: z.string(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

export class LoginClientDto extends createZodDto(LoginClientSchema) {}
