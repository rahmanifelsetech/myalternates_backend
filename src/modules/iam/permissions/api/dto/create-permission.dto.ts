import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreatePermissionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
});

export class CreatePermissionDto extends createZodDto(CreatePermissionSchema) {}
