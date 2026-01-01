import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { schemes } from '../../../infrastructure/schemas/amc/schemes.schema';
import { scheme_fund_managers } from '../../../infrastructure/schemas/amc/scheme_fund_managers.schema';
import { scheme_performance } from '../../../infrastructure/schemas/amc/scheme_performance.schema';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

export type Scheme = InferSelectModel<typeof schemes>;
export type NewScheme = InferInsertModel<typeof schemes>;

export type SchemeFundManager = InferSelectModel<typeof scheme_fund_managers>;
export type NewSchemeFundManager = InferInsertModel<typeof scheme_fund_managers>;

export type SchemePerformance = InferSelectModel<typeof scheme_performance>;
export type NewSchemePerformance = InferInsertModel<typeof scheme_performance>;

export type SchemeWithRelations = Scheme & {
  fundManagers?: SchemeFundManager[];
  performance?: SchemePerformance[];
};

export abstract class SchemesRepositoryInterface {
  abstract create(data: NewScheme): Promise<Scheme>;
  abstract update(id: string, data: Partial<NewScheme>): Promise<Scheme | undefined>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<SchemeWithRelations | undefined>;
  abstract findAll(params: PaginationQueryDto): Promise<PaginatedResponse<Scheme>>;
  
  // Relations Management
  abstract addFundManagers(data: NewSchemeFundManager[]): Promise<SchemeFundManager[]>;
  abstract removeFundManagers(schemeId: string): Promise<void>;
  abstract updateFundManagerHistory(schemeId: string, managerIds: string[]): Promise<void>;
  
  abstract addPerformance(data: NewSchemePerformance[]): Promise<SchemePerformance[]>;
  abstract clearPerformance(schemeId: string): Promise<void>;
}