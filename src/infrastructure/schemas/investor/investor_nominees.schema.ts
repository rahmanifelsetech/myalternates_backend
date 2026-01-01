import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investors } from "./investors.schema";

export const investor_nominees = pgTable("investor_nominees", {
    id: uuid("id").defaultRandom().primaryKey(),
    investorId: uuid("investor_id").notNull().references(() => investors.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    idType: varchar("id_type", { length: 50 }), // PAN/Aadhaar/Passport
    idNumber: varchar("id_number", { length: 50 }),
    relationship: varchar("relationship", { length: 100 }), // Spouse, Child, etc.
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const investorNomineesRelations = relations(investor_nominees, ({ one }) => ({
    investor: one(investors, {
        fields: [investor_nominees.investorId],
        references: [investors.id],
    }),
}));


export type InvestorNominee = InferSelectModel<typeof investor_nominees>;
export type NewInvestorNominee = InferInsertModel<typeof investor_nominees>;
