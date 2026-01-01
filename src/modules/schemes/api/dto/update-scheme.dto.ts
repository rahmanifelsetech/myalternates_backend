import { createZodDto } from 'nestjs-zod';
import { CreateSchemeSchema } from './create-scheme.dto';

// For updates, we make everything optional
export const UpdateSchemeSchema = CreateSchemeSchema.partial();

export class UpdateSchemeDto extends createZodDto(UpdateSchemeSchema) {}