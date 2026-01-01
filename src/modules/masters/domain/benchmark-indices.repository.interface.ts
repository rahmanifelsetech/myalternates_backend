import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { benchmark_indices } from '../../../infrastructure/schemas/master/benchmark_indices.schema';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

export type BenchmarkIndex = InferSelectModel<typeof benchmark_indices>;
export type NewBenchmarkIndex = InferInsertModel<typeof benchmark_indices>;

export interface BenchmarkIndicesRepositoryInterface {
  createBenchmarkIndex(data: NewBenchmarkIndex): Promise<BenchmarkIndex>;
  findAllBenchmarkIndices(params: PaginationQueryDto): Promise<PaginatedResponse<BenchmarkIndex>>;
  findBenchmarkIndexById(id: string): Promise<BenchmarkIndex | undefined>;
  updateBenchmarkIndex(id: string, data: Partial<NewBenchmarkIndex>): Promise<BenchmarkIndex | undefined>;
  deleteBenchmarkIndex(id: string): Promise<boolean>;
}