import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Step 1: User provides personal info and role
export const RegisterStep1Schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string().min(7).max(15),
  countryCode: z.string().min(1),
  role: z.enum(['investor', 'distributor']),
});
export class RegisterStep1Dto extends createZodDto(RegisterStep1Schema) {}

// Step 2: User provides credentials
export const RegisterStep2Schema = z.object({
  userId: z.uuid(), // Used to find the user from step 1
  username: z.string(),
  password: z.string().min(8),
  terms: z.boolean().default(true),
});
export class RegisterStep2Dto extends createZodDto(RegisterStep2Schema) {}
