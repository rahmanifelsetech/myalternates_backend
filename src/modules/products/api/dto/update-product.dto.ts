import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateProductSchema = z.object({
  name: z.string(),
  desc: z.string().optional(),
}).partial();

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
