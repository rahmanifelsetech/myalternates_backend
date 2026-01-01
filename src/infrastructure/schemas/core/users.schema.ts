import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar, integer, boolean, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { roles } from './roles.schema';

export const userAppTypeEnum = pgEnum('user_app_type', ['ADMIN', 'INVESTOR', 'DISTRIBUTOR']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  password: text('password'),
  phone: varchar('phone', { length: 255 }),
  countryCode: varchar('country_code', { length: 20 }),
  username: varchar('username', { length: 255 }).unique(),
  userCode: varchar('user_code', { length: 255 }).unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  terms: boolean('terms').default(true).notNull(),
  roleId: uuid('role_id').references(() => roles.id),
  appType: userAppTypeEnum('app_type'),
  lastLoginAt: timestamp('last_login_at', { mode: 'string' }),
  lastActivityAt: timestamp('last_activity_at', { mode: 'string' }),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
  createdById: uuid('created_by_id').references(() => users.id),
  updatedById: uuid('updated_by_id').references(() => users.id),
  requiresPasswordChange: boolean('requires_password_change').default(false).notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));
