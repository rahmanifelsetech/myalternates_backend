import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdatePermissionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
}).partial();

export class UpdatePermissionDto extends createZodDto(UpdatePermissionSchema) {}
