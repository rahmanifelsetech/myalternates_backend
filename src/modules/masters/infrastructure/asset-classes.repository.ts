import { Injectable } from '@nestjs/common';
import { eq, SQL, count, ilike, or, and } from 'drizzle-orm';
import * as schema from '../../../infrastructure/schemas';
import { BaseRepository } from '../../../infrastructure/repositories/base/base.repository';
import { AssetClassesRepositoryInterface, AssetClass, NewAssetClass } from '../domain/asset-classes.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class AssetClassesRepository extends BaseRepository implements AssetClassesRepositoryInterface {
  async createAssetClass(data: NewAssetClass): Promise<AssetClass> {
    const [result] = await this.db
      .insert(schema.asset_classes)
      .values(data)
      .returning();
    return result;
  }

  async findAllAssetClasses({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<AssetClass>> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [];

    if (search) {
      const searchCondition = or(
        ilike(schema.asset_classes.name, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.asset_classes.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (asset_classes, { asc, desc }) => [
          orderDirection === 'asc'
            ? asc(asset_classes[orderBy])
            : desc(asset_classes[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(schema.asset_classes)
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

  async findAssetClassById(id: string): Promise<AssetClass | undefined> {
    return this.db.query.asset_classes.findFirst({
      where: eq(schema.asset_classes.id, id),
    });
  }

  async updateAssetClass(id: string, data: Partial<NewAssetClass>): Promise<AssetClass | undefined> {
    const [result] = await this.db
      .update(schema.asset_classes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.asset_classes.id, id))
      .returning();
    return result;
  }

  async deleteAssetClass(id: string): Promise<boolean> {
    const [result] = await this.db
      .delete(schema.asset_classes)
      .where(eq(schema.asset_classes.id, id))
      .returning();
    return !!result;
  }
}