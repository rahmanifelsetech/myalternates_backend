import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/infrastructure/repositories/base/base.repository';
import { products } from '@app/infrastructure/schemas/master/products.schema';
import { eq, ilike, or, and, SQL, count } from 'drizzle-orm';
import { CreateProductDto } from '../api/dto/create-product.dto';
import {
  IProductsRepository,
  NewProduct,
  Product,
  PaginatedProductsResult,
  FindAllProductsParams,
} from '../domain/products.repository.interface';

@Injectable()
export class ProductsRepository
  extends BaseRepository
  implements IProductsRepository
{
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct: NewProduct = {
      ...createProductDto,
    };
    const [product] = await this.db
      .insert(products)
      .values(newProduct)
      .returning();
    return product;
  }

  async findAll({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: FindAllProductsParams): Promise<PaginatedProductsResult> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [];

    if (search) {
      const searchCondition = or(
        ilike(products.name, `%${search}%`),
        ilike(products.desc, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.products.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (products, { asc, desc }) => [
          orderDirection === 'asc'
            ? asc(products[orderBy])
            : desc(products[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(products)
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

  async findOne(id: string): Promise<Product | undefined> {
    return this.db.query.products.findFirst({
      where: eq(products.id, id),
    });
  }

  async update(
    id: string,
    updateProductDto: Partial<Omit<NewProduct, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Product> {
    const [product] = await this.db
      .update(products)
      .set(updateProductDto)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async remove(id: string): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id));
  }
}
