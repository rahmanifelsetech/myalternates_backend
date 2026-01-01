import { pgTable, uuid, varchar, text, timestamp, date, boolean, index } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investor_investments } from "./investor_investments.schema";
import { investor_documents } from "./investor_documents.schema";

export const investors = pgTable("investors", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    // Holder 1 (Primary) Details / Entity Details
    name: varchar("name", { length: 255 }).notNull(), // Holder 1 Name
    pan: varchar("pan", { length: 10 }).unique().notNull(), // Holder 1 PAN
    dateOfBirth: date("date_of_birth"), // Holder 1 DOB
    gender: varchar("gender", { length: 20 }), // Male/Female/Other
    
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
    
    // Status & Classification
    residentialStatus: varchar("residential_status", { length: 50 }).notNull(), // Resident/NRI/Non-Individual
    subStatus: varchar("sub_status", { length: 100 }).default('None'), // Pvt Ltd, Trust, HUF, etc.
    
    // Guardian (if minor)
    guardianName: varchar("guardian_name", { length: 255 }),
    guardianIdType: varchar("guardian_id_type", { length: 50 }),
    guardianIdNumber: varchar("guardian_id_number", { length: 50 }),

    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    index("inv_name_idx").on(table.name),
    index("inv_email_idx").on(table.email),
]);

export const investorsRelations = relations(investors, ({ many }) => ({
    investments: many(investor_investments),
    documents: many(investor_documents),
}));

export type Investor = InferSelectModel<typeof investors>;
export type NewInvestor = InferInsertModel<typeof investors>;
