import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { asset_classes } from '../../../../infrastructure/schemas/master/asset_classes.schema';
import { benchmark_indices } from '../../../../infrastructure/schemas/master/benchmark_indices.schema';
import { fund_managers } from '../../../../infrastructure/schemas/master/fund_managers.schema';
import { categories } from '../../../../infrastructure/schemas/master/categories.schema';

// Asset Classes
export const CreateAssetClassSchema = createInsertSchema(asset_classes, {
  name: (schema) => schema.min(1),
}).omit({ 
  createdAt: true, 
  updatedAt: true,
  id: true 
});
export class CreateAssetClassDto extends createZodDto(CreateAssetClassSchema) {}

export const UpdateAssetClassSchema = CreateAssetClassSchema.partial();
export class UpdateAssetClassDto extends createZodDto(UpdateAssetClassSchema) {}

// Benchmark Indices
export const CreateBenchmarkIndexSchema = createInsertSchema(benchmark_indices, {
  name: (schema) => schema.min(1),
}).omit({ 
  createdAt: true, 
  updatedAt: true,
  id: true 
});
export class CreateBenchmarkIndexDto extends createZodDto(CreateBenchmarkIndexSchema) {}

export const UpdateBenchmarkIndexSchema = CreateBenchmarkIndexSchema.partial();
export class UpdateBenchmarkIndexDto extends createZodDto(UpdateBenchmarkIndexSchema) {}

// Fund Managers
export const CreateFundManagerSchema = createInsertSchema(fund_managers, {
  name: (schema) => schema.min(1),
}).omit({ 
  createdAt: true, 
  updatedAt: true,
  id: true 
});
export class CreateFundManagerDto extends createZodDto(CreateFundManagerSchema) {}

export const UpdateFundManagerSchema = CreateFundManagerSchema.partial();
export class UpdateFundManagerDto extends createZodDto(UpdateFundManagerSchema) {}

// Categories
export const CreateCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.min(1),
}).omit({ 
  createdAt: true, 
  updatedAt: true,
  id: true 
});
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

export const UpdateCategorySchema = CreateCategorySchema.partial();
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}