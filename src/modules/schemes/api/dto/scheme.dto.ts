import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { schemes } from '@app/infrastructure/schemas';
import { z } from 'zod';

const CreateSchemeSchema = createInsertSchema(schemes, {
  schemeInceptionDate: z.string().datetime(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isFeatured: true,
  isSuggested: true,
  isOpenForSubscription: true,
  priorityOrder: true,
});

const UpdateSchemeSchema = CreateSchemeSchema.partial();

export class CreateSchemeDto extends createZodDto(CreateSchemeSchema) {}
export class UpdateSchemeDto extends createZodDto(UpdateSchemeSchema) {}