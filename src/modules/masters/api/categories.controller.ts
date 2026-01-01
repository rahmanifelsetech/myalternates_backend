import { Controller, Get, Post, Body, Param, Query, NotFoundException, Put, Delete } from '@nestjs/common';
import { CategoriesService } from '../application/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-master.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { PERMISSIONS } from '@app/shared/constants/permissions.constants';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import {
  createPaginatedResponse,
  createSingleResponse,
  createEmptyResponse,
} from '@app/shared/utils/response.helper';
import {
  SingleResponse,
  PaginatedResponse,
  EmptyResponse,
} from '@app/shared/interfaces/core/response.type';
import { Category } from '../domain/categories.repository.interface';

@ApiTags('Masters - Categories')
@ApiBearerAuth()
@Controller('masters/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Permissions(PERMISSIONS.MASTERS.CATEGORY_CREATE.slug)
  @ApiOperation({ summary: 'Create Category' })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<SingleResponse<Category>> {
    const category = await this.categoriesService.createCategory(createCategoryDto);
    return createSingleResponse(category, 'Category created successfully');
  }

  @Get()
  @Permissions(PERMISSIONS.MASTERS.CATEGORY_READ.slug)
  @ApiOperation({ summary: 'Get All Categories' })
  async findAllCategories(
    @Query() filters: PaginationQueryDto,
  ): Promise<PaginatedResponse<Category>> {
    const result = await this.categoriesService.findAllCategories(filters);
    return createPaginatedResponse(result.data, result.metaData, 'Categories retrieved successfully');
  }

  @Get(':id')
  @Permissions(PERMISSIONS.MASTERS.CATEGORY_READ.slug)
  @ApiOperation({ summary: 'Get Category by ID' })
  async findCategoryById(
    @Param('id') id: string,
  ): Promise<SingleResponse<Category>> {
    const category = await this.categoriesService.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return createSingleResponse(category, 'Category retrieved successfully');
  }

  @Put(':id')
  @Permissions(PERMISSIONS.MASTERS.CATEGORY_UPDATE.slug)
  @ApiOperation({ summary: 'Update Category' })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<SingleResponse<Category>> {
    const category = await this.categoriesService.updateCategory(
      id,
      updateCategoryDto,
    );
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return createSingleResponse(category, 'Category updated successfully');
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.MASTERS.CATEGORY_DELETE.slug)
  @ApiOperation({ summary: 'Delete Category' })
  async deleteCategory(@Param('id') id: string): Promise<EmptyResponse> {
    const deleted = await this.categoriesService.deleteCategory(id);
    if (!deleted) {
      throw new NotFoundException(`Category with ID "${id}" not found for deletion`);
    }
    return createEmptyResponse('Category deleted successfully');
  }
}