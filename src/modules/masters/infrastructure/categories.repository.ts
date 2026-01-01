import { Injectable } from '@nestjs/common';
import { eq, SQL, count, ilike, or, and } from 'drizzle-orm';
import * as schema from '../../../infrastructure/schemas';
import { BaseRepository } from '../../../infrastructure/repositories/base/base.repository';
import { CategoriesRepositoryInterface, Category, NewCategory } from '../domain/categories.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class CategoriesRepository extends BaseRepository implements CategoriesRepositoryInterface {
  async createCategory(data: NewCategory): Promise<Category> {
    const res = await this.db
      .insert(schema.categories)
      .values(data as NewCategory)
      .returning();
    return res[0] as unknown as Category;
  }

  async findAllCategories({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<Category>> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [];

    if (search) {
      const searchCondition = or(
        ilike(schema.categories.name, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.categories.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (categories, { asc, desc }) => [
          orderDirection === 'asc'
            ? asc(categories[orderBy])
            : desc(categories[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(schema.categories)
        .where(and(...whereClauses)),
    ]);

    return {
      data: data as Category[],
      metaData: {
        total: total[0].value,
        page,
        limit,
        totalPages: Math.ceil(total[0].value / limit),
      },
    };
  }

  async findCategoryById(id: string): Promise<Category | undefined> {
    const res = await this.db.query.categories.findFirst({
      where: eq(schema.categories.id, id),
    });
    return res as unknown as Category | undefined;
  }

  async updateCategory(id: string, data: Partial<NewCategory>): Promise<Category | undefined> {
    const res = await this.db
      .update(schema.categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.categories.id, id))
      .returning();
    return res[0] as unknown as Category | undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const res = await this.db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id))
      .returning();
    return !!(res && res[0]);
  }
}