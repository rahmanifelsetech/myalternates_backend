import { pgTable, uuid, text, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { investors } from "./investors.schema";
import { users } from "../core/users.schema";

export const investorDocumentType = pgEnum("investor_document_type", [
    "pan",
    "aadhaar",
    "passport",
    "address_proof",
    "bank_proof",
    "other"
]);

export const investor_documents = pgTable("investor_documents", {
    id: uuid("id").defaultRandom().primaryKey(),
    investorId: uuid("investor_id").notNull().references(() => investors.id, { onDelete: "cascade" }),
    documentType: investorDocumentType("document_type").notNull(),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name"),
    fileSize: integer("file_size").notNull(),
    mimeType: text("mime_type"),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
    uploadedBy: uuid("uploaded_by").references(() => users.id),
});

export const investorDocumentsRelations = relations(investor_documents, ({ one }) => ({
    investor: one(investors, {
        fields: [investor_documents.investorId],
        references: [investors.id],
    }),
}));

export type InvestorDocument = InferSelectModel<typeof investor_documents>;
export type NewInvestorDocument = InferInsertModel<typeof investor_documents>;
