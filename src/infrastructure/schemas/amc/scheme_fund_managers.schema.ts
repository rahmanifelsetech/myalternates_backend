import { pgTable, uuid, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { schemes } from "./schemes.schema";
import { fund_managers } from "../master/fund_managers.schema";

export const scheme_fund_managers = pgTable("scheme_fund_managers", {
    id: uuid("id").defaultRandom().primaryKey(),
    schemeId: uuid("scheme_id").notNull().references(() => schemes.id, { onDelete: "cascade" }),
    fundManagerId: uuid("fund_manager_id").notNull().references(() => fund_managers.id),
    
    fromDate: date("from_date").notNull(),
    toDate: date("to_date"), // Null means currently active
    isCurrent: boolean("is_current").default(true).notNull(),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type SchemeFundManager = InferSelectModel<typeof scheme_fund_managers>;
export type NewSchemeFundManager = InferInsertModel<typeof scheme_fund_managers>;