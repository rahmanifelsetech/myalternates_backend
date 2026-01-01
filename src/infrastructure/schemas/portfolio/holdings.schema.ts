import { pgTable, uuid, varchar, timestamp, date, numeric, index } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investor_investments } from "../investor/investor_investments.schema";
import { market_list } from "../master/market_list.schema";

export const holdings = pgTable("holdings", {
    id: uuid("id").defaultRandom().primaryKey(),
    investmentId: uuid("investment_id").notNull().references(() => investor_investments.id, { onDelete: "cascade" }),
    clientCode: varchar("client_code", { length: 50 }),
    
    // Link to Security
    marketListId: uuid("market_list_id").references(() => market_list.id), // Link to Master
    isinCode: varchar("isin_code", { length: 50 }), // Optional redundant, or fallback if master not populated
    securityName: varchar("security_name", { length: 255 }), // Snapshot
    securityType: varchar("security_type", { length: 50 }), // Equity, Bond, etc.
    
    valuationDate: date("valuation_date").notNull(),
    quantity: numeric("quantity", { precision: 20, scale: 4 }),
    averagePrice: numeric("average_price", { precision: 20, scale: 2 }),
    marketPrice: numeric("market_price", { precision: 20, scale: 2 }),
    currentValue: numeric("current_value", { precision: 20, scale: 2 }),
    portfolioWeightage: numeric("portfolio_weightage", { precision: 5, scale: 2 }),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("hld_inv_idx").on(table.investmentId),
    index("hld_date_idx").on(table.valuationDate),
    index("hld_market_list_idx").on(table.marketListId),
]);

export const holdingsRelations = relations(holdings, ({ one }) => ({
    investment: one(investor_investments, {
        fields: [holdings.investmentId],
        references: [investor_investments.id],
    }),
    security: one(market_list, {
        fields: [holdings.marketListId],
        references: [market_list.id],
    }),
}));

export type Holding = InferSelectModel<typeof holdings>;
export type NewHolding = InferInsertModel<typeof holdings>;
