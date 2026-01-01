import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const asset_classes = pgTable("asset_classes", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type AssetClass = InferSelectModel<typeof asset_classes>;
export type NewAssetClass = InferInsertModel<typeof asset_classes>;