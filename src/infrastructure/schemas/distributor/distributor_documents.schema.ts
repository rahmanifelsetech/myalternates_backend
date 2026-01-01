import { pgTable, uuid, text, timestamp, pgEnum, serial } from "drizzle-orm/pg-core";
import { sql, InferSelectModel, InferInsertModel } from "drizzle-orm";
import { distributors } from "./distributors.schema";


export const distributorDocumentType = pgEnum("distributor_document_type", [
    "passport",
    "id_card",
    "license",
]);

export const distributor_documents = pgTable("distributor_documents", {
    id: uuid("id").primaryKey().defaultRandom(),
    distributor_id: uuid("distributor_id").notNull().references(() => distributors.id),
    document_type: distributorDocumentType("document_type").notNull(),
    file_url: text("file_url").notNull(),
    uploaded_at: timestamp("uploaded_at", { mode: "date" }).defaultNow(),
});

export type DistributorDocument = InferSelectModel<typeof distributor_documents>;
export type NewDistributorDocument = InferInsertModel<typeof distributor_documents>;
