import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { categories } from '../../../infrastructure/schemas/master/categories.schema';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export interface CategoriesRepositoryInterface {
  createCategory(data: NewCategory): Promise<Category>;
  findAllCategories(params: PaginationQueryDto): Promise<PaginatedResponse<Category>>;
  findCategoryById(id: string): Promise<Category | undefined>;
  updateCategory(id: string, data: Partial<NewCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
}