import { Injectable } from '@nestjs/common';
import { eq, SQL, count, ilike, or, and } from 'drizzle-orm';
import * as schema from '../../../infrastructure/schemas';
import { BaseRepository } from '../../../infrastructure/repositories/base/base.repository';
import { BenchmarkIndicesRepositoryInterface, BenchmarkIndex, NewBenchmarkIndex } from '../domain/benchmark-indices.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class BenchmarkIndicesRepository extends BaseRepository implements BenchmarkIndicesRepositoryInterface {
  async createBenchmarkIndex(data: NewBenchmarkIndex): Promise<BenchmarkIndex> {
    const [result] = await this.db
      .insert(schema.benchmark_indices)
      .values(data)
      .returning();
    return result;
  }

  async findAllBenchmarkIndices({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<BenchmarkIndex>> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [];

    if (search) {
      const searchCondition = or(
        ilike(schema.benchmark_indices.name, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.benchmark_indices.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (benchmark_indices, { asc, desc }) => [
          orderDirection === 'asc'
            ? asc(benchmark_indices[orderBy])
            : desc(benchmark_indices[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(schema.benchmark_indices)
        .where(and(...whereClauses)),
    ]);

    return {
      data,
      metaData: {
        total: total[0].value,
        page,
        limit,
        totalPages: Math.ceil(total[0].value / limit),
      },
    };
  }

  async findBenchmarkIndexById(id: string): Promise<BenchmarkIndex | undefined> {
    return this.db.query.benchmark_indices.findFirst({
      where: eq(schema.benchmark_indices.id, id),
    });
  }

  async updateBenchmarkIndex(id: string, data: Partial<NewBenchmarkIndex>): Promise<BenchmarkIndex | undefined> {
    const [result] = await this.db
      .update(schema.benchmark_indices)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.benchmark_indices.id, id))
      .returning();
    return result;
  }

  async deleteBenchmarkIndex(id: string): Promise<boolean> {
    const [result] = await this.db
      .delete(schema.benchmark_indices)
      .where(eq(schema.benchmark_indices.id, id))
      .returning();
    return !!result;
  }
}