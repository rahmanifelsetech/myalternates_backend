import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
}).partial();

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
