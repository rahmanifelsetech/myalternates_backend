import { Injectable } from '@nestjs/common';
import { eq, SQL, count, ilike, or, and } from 'drizzle-orm';
import * as schema from '../../../infrastructure/schemas';
import { BaseRepository } from '../../../infrastructure/repositories/base/base.repository';
import { FundManagersRepositoryInterface, FundManager, NewFundManager } from '../domain/fund-managers.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class FundManagersRepository extends BaseRepository implements FundManagersRepositoryInterface {
  async createFundManager(data: NewFundManager): Promise<FundManager> {
    const [result] = await this.db
      .insert(schema.fund_managers)
      .values(data)
      .returning();
    return result;
  }

  async findAllFundManagers({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<FundManager>> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [];

    if (search) {
      const searchCondition = or(
        ilike(schema.fund_managers.name, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.fund_managers.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (fund_managers, { asc, desc }) => [
          orderDirection === 'asc'
            ? asc(fund_managers[orderBy])
            : desc(fund_managers[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(schema.fund_managers)
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

  async findFundManagerById(id: string): Promise<FundManager | undefined> {
    return this.db.query.fund_managers.findFirst({
      where: eq(schema.fund_managers.id, id),
    });
  }

  async updateFundManager(id: string, data: Partial<NewFundManager>): Promise<FundManager | undefined> {
    const [result] = await this.db
      .update(schema.fund_managers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.fund_managers.id, id))
      .returning();
    return result;
  }

  async deleteFundManager(id: string): Promise<boolean> {
    const [result] = await this.db
      .delete(schema.fund_managers)
      .where(eq(schema.fund_managers.id, id))
      .returning();
    return !!result;
  }
}