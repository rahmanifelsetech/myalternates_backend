import { pgTable, uuid, varchar, timestamp, date, index } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { holdings } from "../portfolio/holdings.schema";

export const market_list = pgTable("market_list", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    isinCode: varchar("isin_code", { length: 50 }).unique().notNull(),
    categorization: varchar("categorization", { length: 100 }), // Large Cap, etc.
    sector: varchar("sector", { length: 100 }),
    asOnDate: date("as_on_date"),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("mkt_company_idx").on(table.companyName),
    index("mkt_isin_idx").on(table.isinCode),
]);

export const marketListRelations = relations(market_list, ({ many }) => ({
    holdings: many(holdings),
}));

export type MarketSecurity = InferSelectModel<typeof market_list>;
export type NewMarketSecurity = InferInsertModel<typeof market_list>;
