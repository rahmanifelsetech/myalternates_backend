import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { investors } from "./investors.schema";

export const investor_banks = pgTable("investor_banks", {
    id: uuid("id").defaultRandom().primaryKey(),
    investorId: uuid("investor_id").notNull().references(() => investors.id, { onDelete: "cascade" }),
    bankName: varchar("bank_name", { length: 255 }).notNull(),
    accountNumber: varchar("account_number", { length: 50 }).notNull(),
    ifscCode: varchar("ifsc_code", { length: 11 }).notNull(),
    accountType: varchar("account_type", { length: 50 }).notNull(), // Savings, Current, etc.
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type InvestorBank = InferSelectModel<typeof investor_banks>;
export type NewInvestorBank = InferInsertModel<typeof investor_banks>;
