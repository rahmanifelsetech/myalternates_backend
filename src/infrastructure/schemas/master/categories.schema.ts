import { pgTable, uuid, varchar, text, date, integer, boolean, timestamp, numeric } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    color: varchar('color', { length: 7 }),
    parentCategoryId: uuid('parent_category_id').references(() => categories.id, { onDelete: "set null" }),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
