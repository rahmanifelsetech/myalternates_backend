import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional().default(10),
  page: z.coerce.number().int().positive().optional().default(1),
  search: z.string().optional(),
  orderBy: z.string().optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
});

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
