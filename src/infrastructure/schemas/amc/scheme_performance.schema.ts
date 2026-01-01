import { pgTable, uuid, varchar, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { schemes } from "./schemes.schema";

export const scheme_performance = pgTable("scheme_performance", {
    id: uuid("id").defaultRandom().primaryKey(),
    schemeId: uuid("scheme_id").notNull().references(() => schemes.id, { onDelete: "cascade" }),
    
    performanceType: varchar("performance_type", { length: 50 }).notNull(), // 'Financial Year' or 'Calendar Year'
    year: varchar("year", { length: 20 }).notNull(), // e.g., "2023-2024" or "2023"
    displayOrder: integer("display_order").default(0),
    
    schemePerformance: numeric("scheme_performance"),
    benchmarkPerformance: numeric("benchmark_performance"),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type SchemePerformance = InferSelectModel<typeof scheme_performance>;
export type NewSchemePerformance = InferInsertModel<typeof scheme_performance>;