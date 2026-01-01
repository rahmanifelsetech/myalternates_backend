import { Inject, Injectable } from '@nestjs/common';
import { PRODUCTS_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { IProductsRepository } from '../domain/products.repository.interface';
import { CreateProductDto } from '../api/dto/create-product.dto';
import { UpdateProductDto } from '../api/dto/update-product.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY_TOKEN)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  async findAll(params: PaginationQueryDto) {
    return this.productsRepository.findAll(params);
  }

  async findOne(id: string) {
    return this.productsRepository.findOne(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    return this.productsRepository.remove(id);
  }
}
