import { pgTable, uuid, varchar, timestamp, date, numeric, index } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investor_investments } from "../investor/investor_investments.schema";

export const daily_valuations = pgTable("daily_valuations", {
    id: uuid("id").defaultRandom().primaryKey(),
    investmentId: uuid("investment_id").notNull().references(() => investor_investments.id, { onDelete: "cascade" }),
    clientCode: varchar("client_code", { length: 50 }), // Optional reference
    
    valuationDate: date("valuation_date").notNull(),
    valuationAmount: numeric("valuation_amount", { precision: 20, scale: 2 }).notNull(),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("dv_inv_idx").on(table.investmentId),
    index("dv_date_idx").on(table.valuationDate),
]);

export const dailyValuationsRelations = relations(daily_valuations, ({ one }) => ({
    investment: one(investor_investments, {
        fields: [daily_valuations.investmentId],
        references: [investor_investments.id],
    }),
}));

export type DailyValuation = InferSelectModel<typeof daily_valuations>;
export type NewDailyValuation = InferInsertModel<typeof daily_valuations>;
