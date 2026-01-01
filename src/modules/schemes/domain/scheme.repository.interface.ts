import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { schemes } from '@app/infrastructure/schemas';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

export type Scheme = InferSelectModel<typeof schemes>;
export type NewScheme = InferInsertModel<typeof schemes>;
export type UpdateScheme = Partial<NewScheme>;

export const SCHEME_REPOSITORY_TOKEN = Symbol('SCHEME_REPOSITORY');

export interface SchemeRepositoryInterface {
  create(data: NewScheme): Promise<Scheme>;
  findAll(params: PaginationQueryDto): Promise<PaginatedResponse<Scheme>>;
  findById(id: string): Promise<Scheme | undefined>;
  update(id: string, data: UpdateScheme): Promise<Scheme | undefined>;
  delete(id: string): Promise<boolean>;
}