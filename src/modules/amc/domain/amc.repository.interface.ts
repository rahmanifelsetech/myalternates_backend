import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { amcs } from '@app/infrastructure/schemas';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

export type Amc = InferSelectModel<typeof amcs>;
export type NewAmc = InferInsertModel<typeof amcs>;
export type UpdateAmc = Partial<NewAmc>;

export const AMC_REPOSITORY_TOKEN = Symbol('AMC_REPOSITORY');

export interface AmcRepositoryInterface {
  create(data: NewAmc): Promise<Amc>;
  findAll(params: PaginationQueryDto): Promise<PaginatedResponse<Amc>>;
  findById(id: string): Promise<Amc | undefined>;
  update(id: string, data: UpdateAmc): Promise<Amc | undefined>;
  delete(id: string): Promise<boolean>;
}