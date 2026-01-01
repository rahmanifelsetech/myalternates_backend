import { pgTable, uuid, varchar, text, timestamp, date, numeric, boolean } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investor_investments } from "./investor_investments.schema";

export const investor_drawdowns = pgTable("investor_drawdowns", {
    id: uuid("id").defaultRandom().primaryKey(),
    investmentId: uuid("investment_id").notNull().references(() => investor_investments.id, { onDelete: "cascade" }),
    
    drawdownNumber: varchar("drawdown_number", { length: 50 }),
    paymentReferenceNumber: varchar("payment_reference_number", { length: 100 }), // For Reconciliation
    drawdownAmount: numeric("drawdown_amount", { precision: 20, scale: 2 }),
    drawdownPercentage: numeric("drawdown_percentage", { precision: 5, scale: 2 }),
    
    paymentDueDate: date("payment_due_date"),
    paymentReceivedDate: date("payment_received_date"),
    nextDueDate: date("next_due_date"),
    
    lateFee: numeric("late_fee", { precision: 20, scale: 2 }), // Interest/Compliance
    
    remarks: text("remarks"),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const investorDrawdownsRelations = relations(investor_drawdowns, ({ one }) => ({
    investment: one(investor_investments, {
        fields: [investor_drawdowns.investmentId],
        references: [investor_investments.id],
    }),
}));

export type InvestorDrawdown = InferSelectModel<typeof investor_drawdowns>;
export type NewInvestorDrawdown = InferInsertModel<typeof investor_drawdowns>;
