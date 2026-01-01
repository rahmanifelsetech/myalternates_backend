import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { fund_managers } from '../../../infrastructure/schemas/master/fund_managers.schema';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

export type FundManager = InferSelectModel<typeof fund_managers>;
export type NewFundManager = InferInsertModel<typeof fund_managers>;

export interface FundManagersRepositoryInterface {
  createFundManager(data: NewFundManager): Promise<FundManager>;
  findAllFundManagers(params: PaginationQueryDto): Promise<PaginatedResponse<FundManager>>;
  findFundManagerById(id: string): Promise<FundManager | undefined>;
  updateFundManager(id: string, data: Partial<NewFundManager>): Promise<FundManager | undefined>;
  deleteFundManager(id: string): Promise<boolean>;
}