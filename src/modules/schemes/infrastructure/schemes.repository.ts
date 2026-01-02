import { Injectable } from '@nestjs/common';
import { eq, and, isNull, SQL, ilike, or, count } from 'drizzle-orm';
import * as schema from '../../../infrastructure/schemas';
import { BaseRepository } from '../../../infrastructure/repositories/base/base.repository';
import { SchemesRepositoryInterface, Scheme, SchemeWithRelations, NewScheme, NewSchemeFundManager, SchemeFundManager, NewSchemePerformance, SchemePerformance } from '../domain/schemes.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class SchemesRepository extends BaseRepository implements SchemesRepositoryInterface {
  
  async create(data: NewScheme): Promise<Scheme> {
    const [result] = await this.db
      .insert(schema.schemes)
      .values(data)
      .returning();
    return result;
  }

  async update(id: string, data: Partial<NewScheme>): Promise<Scheme | undefined> {
    const [result] = await this.db
      .update(schema.schemes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.schemes.id, id))
      .returning();
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await this.db
      .delete(schema.schemes)
      .where(eq(schema.schemes.id, id))
      .returning();
    return !!result;
  }

  async findById(id: string): Promise<SchemeWithRelations | undefined> {
    const result = await this.db.query.schemes.findFirst({
      where: eq(schema.schemes.id, id),
      with: {
        fundManagers: true, 
      }
    });
    return result as unknown as SchemeWithRelations;
  }

  async findAll({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<Scheme>> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [];

    if (search) {
      const searchCondition = or(
        ilike(schema.schemes.schemeName, `%${search}%`),
        ilike(schema.schemes.schemeType, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.schemes.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (schemes, { asc, desc }) => [
          orderDirection === 'asc'
            ? asc(schemes[orderBy])
            : desc(schemes[orderBy]),
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

  // Relations Management
  
  async addFundManagers(data: NewSchemeFundManager[]): Promise<SchemeFundManager[]> {
    if (data.length === 0) return [];
    // Cast dates to string if needed by schema (depends on if schema uses mode: 'string')
    // scheme_fund_managers uses date(), which expects string YYYY-MM-DD or Date object depending on driver.
    // Drizzle-orm/node-postgres with date() usually takes string.
    return this.db
      .insert(schema.scheme_fund_managers)
      .values(data)
      .returning();
  }

  async removeFundManagers(schemeId: string): Promise<void> {
     await this.db
        .update(schema.scheme_fund_managers)
        .set({ isCurrent: false, toDate: new Date().toISOString() })
        .where(
            and(
                eq(schema.scheme_fund_managers.schemeId, schemeId),
                eq(schema.scheme_fund_managers.isCurrent, true)
            )
        );
  }

  async updateFundManagerHistory(schemeId: string, managerIds: string[]): Promise<void> {
      // 1. Mark all current active managers as inactive
      await this.removeFundManagers(schemeId);

      // 2. Insert new managers as active
      if (managerIds.length > 0) {
          const newManagers: NewSchemeFundManager[] = managerIds.map(managerId => ({
              schemeId,
              fundManagerId: managerId,
              fromDate: new Date().toISOString(),
              isCurrent: true
          }));
          await this.addFundManagers(newManagers);
      }
  }

  async addPerformance(data: NewSchemePerformance[]): Promise<SchemePerformance[]> {
    if (data.length === 0) return [];
    return this.db
      .insert(schema.scheme_performance)
      .values(data)
      .returning();
  }

  async clearPerformance(schemeId: string): Promise<void> {
    await this.db
      .delete(schema.scheme_performance)
      .where(eq(schema.scheme_performance.schemeId, schemeId));
  }
}
