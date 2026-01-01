import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { roles } from './roles.schema';
import { permissions } from './permissions.schema';
import { relations } from 'drizzle-orm';

export const rolesToPermissions = pgTable(
  'roles_to_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  }),
);

export const rolesToPermissionsRelations = relations(rolesToPermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolesToPermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolesToPermissions.permissionId],
    references: [permissions.id],
  }),
}));

export type RoleToPermission = typeof rolesToPermissions;
