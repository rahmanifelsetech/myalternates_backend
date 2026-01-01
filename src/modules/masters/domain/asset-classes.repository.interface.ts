import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { asset_classes } from '../../../infrastructure/schemas/master/asset_classes.schema';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

export type AssetClass = InferSelectModel<typeof asset_classes>;
export type NewAssetClass = InferInsertModel<typeof asset_classes>;

export interface AssetClassesRepositoryInterface {
  createAssetClass(data: NewAssetClass): Promise<AssetClass>;
  findAllAssetClasses(params: PaginationQueryDto): Promise<PaginatedResponse<AssetClass>>;
  findAssetClassById(id: string): Promise<AssetClass | undefined>;
  updateAssetClass(id: string, data: Partial<NewAssetClass>): Promise<AssetClass | undefined>;
  deleteAssetClass(id: string): Promise<boolean>;
}