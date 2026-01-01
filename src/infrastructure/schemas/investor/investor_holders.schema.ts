import { pgTable, uuid, varchar, text, timestamp, date, boolean, index } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investors } from "./investors.schema";
// Circular dependency avoidance: We won't import the link table here for relations if it causes issues.
// import { investor_investment_holders } from "./investor_investment_holders.schema";

export const investor_holders = pgTable("investor_holders", {
    id: uuid("id").defaultRandom().primaryKey(),
    investorId: uuid("investor_id").notNull().references(() => investors.id, { onDelete: "cascade" }),
    
    // Personal Details
    name: varchar("name", { length: 255 }).notNull(),
    pan: varchar("pan", { length: 10 }),
    dateOfBirth: date("date_of_birth"),
    gender: varchar("gender", { length: 20 }),
    
    // Contact
    mobile: varchar("mobile", { length: 20 }),
    email: varchar("email", { length: 255 }),
    
    // Address
    address1: text("address_1"),
    address2: text("address_2"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }),
    pincode: varchar("pincode", { length: 20 }),
    
    // Guardian (if minor)
    guardianName: varchar("guardian_name", { length: 255 }),
    guardianIdType: varchar("guardian_id_type", { length: 50 }),
    guardianIdNumber: varchar("guardian_id_number", { length: 50 }),

    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("hld_investor_idx").on(table.investorId),
    index("hld_pan_idx").on(table.pan),
]);

export const investorHoldersRelations = relations(investor_holders, ({ one, many }) => ({
    investor: one(investors, {
        fields: [investor_holders.investorId],
        references: [investors.id],
    }),
    // investmentLinks: many(investor_investment_holders), // Commented out to avoid circular dep
}));

export type InvestorHolder = InferSelectModel<typeof investor_holders>;
export type NewInvestorHolder = InferInsertModel<typeof investor_holders>;
