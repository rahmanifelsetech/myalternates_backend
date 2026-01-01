import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { amcs } from '@app/infrastructure/schemas';
import { numberPreprocess, booleanPreprocess, datePreprocess } from '@app/shared/utils/zod.utils';
import z from 'zod';

const CreateAmcSchema = createInsertSchema(amcs, {
    // Override numeric fields to handle string-to-number conversion
    noOfStrategies: numberPreprocess,
    priorityOrder: numberPreprocess,
    aum: numberPreprocess,

    // Override date fields to handle string-to-date conversion
    inceptionDate: datePreprocess,
    
    // Override boolean fields to handle string-to-boolean conversion
    restrictDisplay: booleanPreprocess,
    isFeatured: booleanPreprocess,
    isActive: booleanPreprocess,
    isDeleted: booleanPreprocess,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateAmcSchema = CreateAmcSchema.partial().extend({
  filesToRemove: z.array(z.string()).optional(),
});

export class CreateAmcDto extends createZodDto(CreateAmcSchema) {}
export class UpdateAmcDto extends createZodDto(UpdateAmcSchema) {}