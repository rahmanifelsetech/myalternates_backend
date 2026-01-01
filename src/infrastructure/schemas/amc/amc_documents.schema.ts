import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { amcs } from "./amc.schema";

export const amcDocumentType = pgEnum("amc_document_type", [
    "agreement",
    "license",
    "other"
]);

export const amc_documents = pgTable("amc_documents", {
    id: uuid("id").defaultRandom().primaryKey(),
    amcId: uuid("amc_id").notNull().references(() => amcs.id, { onDelete: "cascade" }),
    documentType: amcDocumentType("document_type").notNull(),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name"),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export type AmcDocument = InferSelectModel<typeof amc_documents>;
export type NewAmcDocument = InferInsertModel<typeof amc_documents>;
