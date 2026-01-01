import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { userAppTypeEnum } from '@app/infrastructure/schemas/core/users.schema';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

// Get the Zod schema from the PaginationQueryDto
const PaginationSchema = z.object({
  limit: z.coerce.number().int().positive().optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

const FilterUsersQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  role: z.string().optional(),
  appType: z.enum(userAppTypeEnum.enumValues).optional(),
});

export class FilterUsersQueryDto extends createZodDto(FilterUsersQuerySchema) {}
