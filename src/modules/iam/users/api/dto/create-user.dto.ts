import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { users, userAppTypeEnum } from '@app/infrastructure/schemas';
import { z } from 'zod';
import { datePreprocess } from '@app/shared/utils/zod.utils';

export const createUserSchema = createInsertSchema(users, {
  email: z.email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  appType: z.enum(userAppTypeEnum.enumValues).optional(),
  lastLoginAt: datePreprocess,
  lastActivityAt: datePreprocess,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

const createInternalUserSchema = createInsertSchema(users, {
  email: z.email(),
  phone: z.string().min(10),
  countryCode: z.string().min(1),
  isActive: z.boolean().optional(),
  username: z.string().min(3),
  userCode: z.string().min(3),
  roleId: z.uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1).optional(),
  appType: z.enum(userAppTypeEnum.enumValues).optional(),
  lastLoginAt: datePreprocess,
  lastActivityAt: datePreprocess,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateInternalUserDto extends createZodDto(createInternalUserSchema) {}