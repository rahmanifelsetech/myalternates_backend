import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createUserSchema } from './create-user.dto';

const UpdateUserSchema = createUserSchema.partial();

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
