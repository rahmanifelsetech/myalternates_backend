import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
