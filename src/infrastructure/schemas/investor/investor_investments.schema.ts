import { pgTable, uuid, varchar, text, timestamp, date, numeric, boolean, index } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investors } from "./investors.schema";
import { schemes } from "../amc/schemes.schema";
import { distributors } from "../distributor/distributors.schema";
import { users } from "../core/users.schema";
import { products } from "../master/products.schema";
import { investor_banks } from "./investor_banks.schema";
import { investor_investment_holders } from "./investor_investment_holders.schema";
import { investor_nominees } from "./investor_nominees.schema";
import { investor_drawdowns } from "./investor_drawdowns.schema";
import { transactions } from "../portfolio/transactions.schema";
import { holdings } from "../portfolio/holdings.schema";
import { daily_valuations } from "../portfolio/daily_valuations.schema";

export const investor_investments = pgTable("investor_investments", {
    id: uuid("id").defaultRandom().primaryKey(),
    investorId: uuid("investor_id").notNull().references(() => investors.id),
    
    // Scheme & Product
    productId: uuid("product_id").notNull().references(() => products.id), // PMS/AIF/GIFT/SIF/MF
    schemeId: uuid("scheme_id").notNull().references(() => schemes.id), // Links to AMC Name/Code
    product: varchar("product", { length: 100 }).notNull(), // PMS/AIF/GIFT/SIF/MF
    
    // Account Details
    amcClientCode: varchar("amc_client_code", { length: 50 }),
    strategyCode: varchar("strategy_code", { length: 50 }),
    strategyName: varchar("strategy_name", { length: 100 }),
    inceptionDate: date("inception_date"),
    modeOfHolding: varchar("mode_of_holding", { length: 50 }), // Single / Joint
    
    // Commercials
    amcSharing: numeric("amc_sharing", { precision: 5, scale: 2 }),
    feeStructure: text("fee_structure"),
    
    // Partners & Team
    distributorId: uuid("distributor_id").references(() => distributors.id), // CP Name/Code
    creId: uuid("cre_id").references(() => users.id), // CRE Name/Code
    rmId: uuid("rm_id").references(() => users.id), // RM Name/Code
    fmCode: varchar("fm_code", { length: 50 }), // Fund Manager Code
    branchCode: varchar("branch_code", { length: 50 }),
    
    // Bank Details
    investorBankId: uuid("investor_bank_id").notNull().references(() => investor_banks.id), 
    clientBankName: varchar("client_bank_name", { length: 100 }),
    clientBankAccount: varchar("client_bank_account", { length: 50 }),
    clientBankIfsc: varchar("client_bank_ifsc", { length: 20 }),
    clientAccountType: varchar("client_account_type", { length: 20 }), // Savings/Current/NRE/NRO
    
    // Depository Details
    dpType: varchar("dp_type", { length: 20 }), // NSDL/CDSL
    dpName: varchar("dp_name", { length: 100 }),
    dpId: varchar("dp_id", { length: 50 }),
    clientId: varchar("client_id", { length: 50 }),
    
    remarks: text("remarks"),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("inv_inv_investor_idx").on(table.investorId),
    index("inv_inv_distributor_idx").on(table.distributorId),
    index("inv_inv_scheme_idx").on(table.schemeId),
    index("inv_inv_product_idx").on(table.productId),
]);

export const investorInvestmentsRelations = relations(investor_investments, ({ one, many }) => ({
    investor: one(investors, {
        fields: [investor_investments.investorId],
        references: [investors.id],
    }),
    scheme: one(schemes, {
        fields: [investor_investments.schemeId],
        references: [schemes.id],
    }),
    product: one(products, {
        fields: [investor_investments.productId],
        references: [products.id],
    }),
    distributor: one(distributors, {
        fields: [investor_investments.distributorId],
        references: [distributors.id],
    }),
    investorBank: one(investor_banks, {
        fields: [investor_investments.investorBankId],
        references: [investor_banks.id],
    }),
    
    holders: many(investor_investment_holders),
    // nominees: many(investor_nominees), // Removed invalid relation
    transactions: many(transactions),
    holdings: many(holdings),
    valuations: many(daily_valuations),
    drawdowns: many(investor_drawdowns),
}));

export type Investment = InferSelectModel<typeof investor_investments>;
export type NewInvestment = InferInsertModel<typeof investor_investments>;
