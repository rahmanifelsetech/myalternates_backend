import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const benchmark_indices = pgTable("benchmark_indices", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type BenchmarkIndex = InferSelectModel<typeof benchmark_indices>;
export type NewBenchmarkIndex = InferInsertModel<typeof benchmark_indices>;