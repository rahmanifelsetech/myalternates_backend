import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { amcs } from "../amc/amc.schema";

export const fund_managers = pgTable("fund_managers", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 50 }),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 50 }),
    designation: varchar("designation", { length: 255 }),
    amcId: uuid("amc_id").references(() => amcs.id),
    profilePicture: text("profile_picture"),
    about: text("about"),
    experience: text("experience"),
    fundManagerCreative: text("fund_manager_creative"),
    isFeatured: boolean("is_featured").default(false),
    priorityOrder: integer("priority_order").default(0),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type FundManager = InferSelectModel<typeof fund_managers>;
export type NewFundManager = InferInsertModel<typeof fund_managers>;