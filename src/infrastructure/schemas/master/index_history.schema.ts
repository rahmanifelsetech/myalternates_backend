import { pgTable, uuid, varchar, timestamp, date, numeric } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const index_history = pgTable("index_history", {
    id: uuid("id").defaultRandom().primaryKey(),
    valuationDate: date("valuation_date").notNull(),
    schemeCode: varchar("scheme_code", { length: 50 }), // Or Index Code
    schemeName: varchar("scheme_name", { length: 100 }), // Or Index Name
    
    openValue: numeric("open_value", { precision: 20, scale: 2 }),
    highValue: numeric("high_value", { precision: 20, scale: 2 }),
    lowValue: numeric("low_value", { precision: 20, scale: 2 }),
    closeValue: numeric("close_value", { precision: 20, scale: 2 }),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type IndexHistory = InferSelectModel<typeof index_history>;
export type NewIndexHistory = InferInsertModel<typeof index_history>;
