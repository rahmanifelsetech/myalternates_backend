import { Injectable, Inject } from '@nestjs/common';
import { CategoriesRepositoryInterface } from '../domain/categories.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../api/dto/create-master.dto';
import { CATEGORIES_REPOSITORY_TOKEN } from '../../../infrastructure/database/constants';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY_TOKEN)
    private readonly categoriesRepository: CategoriesRepositoryInterface,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.createCategory(createCategoryDto);
  }

  async findAllCategories(params: PaginationQueryDto) {
    return this.categoriesRepository.findAllCategories(params);
  }

  async findCategoryById(id: string) {
    return this.categoriesRepository.findCategoryById(id);
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesRepository.updateCategory(id, updateCategoryDto);
  }

  async deleteCategory(id: string) {
    return this.categoriesRepository.deleteCategory(id);
  }
}