import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SendOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
});

export class SendOtpDto extends createZodDto(SendOtpSchema) {}