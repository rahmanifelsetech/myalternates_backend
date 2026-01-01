import { pgTable, uuid, integer, timestamp, index, varchar, numeric } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investor_investments } from "./investor_investments.schema";
import { investor_holders } from "./investor_holders.schema";
import { investor_nominees } from "./investor_nominees.schema";

export const investor_investment_holders = pgTable("investor_investment_holders", {
    id: uuid("id").defaultRandom().primaryKey(),
    investmentId: uuid("investment_id").notNull().references(() => investor_investments.id, { onDelete: "cascade" }),
    
    // One of these will be set based on holderType
    holderId: uuid("holder_id").references(() => investor_holders.id, { onDelete: "cascade" }),
    nomineeId: uuid("nominee_id").references(() => investor_nominees.id, { onDelete: "cascade" }),
    
    holderNumber: integer("holder_number").notNull(), // 2, 3 (Used for sorting/display order)
    
    holderType: varchar("holder_type", { length: 20 }).notNull().default('holder'), // 'holder' or 'nominee'
    percentage: numeric("percentage", { precision: 5, scale: 2 }), // Nominee share percentage
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("lnk_hld_inv_idx").on(table.investmentId),
    index("lnk_hld_holder_idx").on(table.holderId),
    index("lnk_hld_nominee_idx").on(table.nomineeId),
]);

export const investorInvestmentHoldersRelations = relations(investor_investment_holders, ({ one }) => ({
    investment: one(investor_investments, {
        fields: [investor_investment_holders.investmentId],
        references: [investor_investments.id],
    }),
    holder: one(investor_holders, {
        fields: [investor_investment_holders.holderId],
        references: [investor_holders.id],
    }),
    nominee: one(investor_nominees, {
        fields: [investor_investment_holders.nomineeId],
        references: [investor_nominees.id],
    }),
}));

export type InvestorInvestmentHolder = InferSelectModel<typeof investor_investment_holders>;
export type NewInvestorInvestmentHolder = InferInsertModel<typeof investor_investment_holders>;
