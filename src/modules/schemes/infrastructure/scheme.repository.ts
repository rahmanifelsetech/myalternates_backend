import { Injectable } from '@nestjs/common';
import { eq, SQL, count, ilike, or, and, desc, asc } from 'drizzle-orm';
import * as schema from '@app/infrastructure/schemas';
import { BaseRepository } from '@app/infrastructure/repositories/base/base.repository';
import { SchemeRepositoryInterface, Scheme, NewScheme, UpdateScheme } from '../domain/scheme.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class SchemeRepository extends BaseRepository implements SchemeRepositoryInterface {
  async create(data: NewScheme): Promise<Scheme> {
    const [result] = await this.db.insert(schema.schemes).values(data).returning();
    return result;
  }

  async findAll({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<Scheme>> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [eq(schema.schemes.isDeleted, false)];

    if (search) {
      const searchClause = or(
        ilike(schema.schemes.schemeName, `%${search}%`),
        ilike(schema.schemes.schemeCode, `%${search}%`),
      );
      if (searchClause) {
        whereClauses.push(searchClause);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.schemes.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (schemes, { asc, desc }) => [
          orderDirection === 'asc' ? asc(schemes[orderBy]) : desc(schemes[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(schema.schemes)
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

  async findById(id: string): Promise<Scheme | undefined> {
    return this.db.query.schemes.findFirst({
      where: and(eq(schema.schemes.id, id), eq(schema.schemes.isDeleted, false)),
    });
  }

  async update(id: string, data: UpdateScheme): Promise<Scheme | undefined> {
    const [result] = await this.db
      .update(schema.schemes)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(schema.schemes.id, id))
      .returning();
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await this.db
      .update(schema.schemes)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(eq(schema.schemes.id, id))
      .returning();
    return !!result;
  }
}