import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { schemes } from '../../../../infrastructure/schemas/amc/schemes.schema';

const Top5ItemSchema = z.object({
  name: z.string(),
  value: z.number(),
});

// Create base schema from Drizzle definition
export const CreateSchemeSchema = createInsertSchema(schemes, {
  schemeCode: (schema) => schema.min(1),
  schemeName: (schema) => schema.min(1),
  // Handle Date fields by forcing them to be strings for API input
  schemeInceptionDate: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Add relation fields not in the main table
  fundManagerIds: z.array(z.string().uuid()).optional(),
  
  // Ensure JSON fields are validated correctly
  top5Holdings: z.array(Top5ItemSchema).optional(),
  top5Sectors: z.array(Top5ItemSchema).optional(),
});

export class CreateSchemeDto extends createZodDto(CreateSchemeSchema) {}