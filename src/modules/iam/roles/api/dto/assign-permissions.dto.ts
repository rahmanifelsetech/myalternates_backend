import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AssignPermissionsSchema = z.object({
  permissionIds: z.array(z.string()),
});

export class AssignPermissionsDto extends createZodDto(AssignPermissionsSchema) {}
