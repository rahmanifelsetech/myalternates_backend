import { Injectable } from '@nestjs/common';
import { eq, SQL, count, ilike, or, and, desc, asc } from 'drizzle-orm';
import * as schema from '@app/infrastructure/schemas';
import { BaseRepository } from '@app/infrastructure/repositories/base/base.repository';
import { AmcRepositoryInterface, Amc, NewAmc, UpdateAmc } from '../domain/amc.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class AmcRepository extends BaseRepository implements AmcRepositoryInterface {
  async create(data: NewAmc): Promise<Amc> {
    const [result] = await this.db.insert(schema.amcs).values(data).returning();
    return result;
  }

  async findAll({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<Amc>> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [eq(schema.amcs.isDeleted, false)];

    if (search) {
      const searchClause = or(ilike(schema.amcs.name, `%${search}%`));
      if (searchClause) {
        whereClauses.push(searchClause);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.amcs.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (amcs, { asc, desc }) => [
          orderDirection === 'asc' ? asc(amcs[orderBy]) : desc(amcs[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(schema.amcs)
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

  async findById(id: string): Promise<Amc | undefined> {
    return this.db.query.amcs.findFirst({
      where: and(eq(schema.amcs.id, id), eq(schema.amcs.isDeleted, false)),
    });
  }

  async update(id: string, data: UpdateAmc): Promise<Amc | undefined> {
    const [result] = await this.db
      .update(schema.amcs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.amcs.id, id))
      .returning();
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await this.db
      .update(schema.amcs)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(schema.amcs.id, id))
      .returning();
    return !!result;
  }
}