import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { products } from '@app/infrastructure/schemas/master/products.schema';
import { CreateProductDto } from '../api/dto/create-product.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type PaginatedProductsResult = PaginatedResponse<Product>;

export type FindAllProductsParams = PaginationQueryDto;

export interface IProductsRepository {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(params: FindAllProductsParams): Promise<PaginatedProductsResult>;
  findOne(id: string): Promise<Product | undefined>;
  update(id: string, updateProductDto: Partial<Omit<NewProduct, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product>;
  remove(id: string): Promise<void>;
}
