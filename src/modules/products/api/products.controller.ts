import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { Permissions } from '@app/shared/decorators/permissions.decorator';
import { PERMISSIONS } from '@app/shared/constants/permissions.constants';
import { ProductsService } from '../application/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createPaginatedResponse, createSuccessResponse } from '@app/shared/utils/response.helper';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permissions(PERMISSIONS.PRODUCTS.CREATE.slug)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return createSuccessResponse(product, 'Product created successfully');
  }

  @Get()
  @Permissions(PERMISSIONS.PRODUCTS.READ.slug)
  async findAll(@Query() filters: PaginationQueryDto) {
    const result = await this.productsService.findAll(filters);
    return createPaginatedResponse(result.data, result.metaData, 'Products retrieved successfully');
  }

  // @Get(':id')
  // @Permissions(PERMISSIONS.PRODUCTS.READ.slug)
  // async findOne(@Param('id') id: string) {
  //   const product = await this.productsService.findOne(id);
  //   return createSuccessResponse(product, 'Product retrieved successfully');
  // }

  @Put(':id')
  @Permissions(PERMISSIONS.PRODUCTS.UPDATE.slug)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(id, updateProductDto);
    return createSuccessResponse(product, 'Product updated successfully');
  }

  // @Delete(':id')
  // @Permissions(PERMISSIONS.PRODUCTS.DELETE.slug)
  // async remove(@Param('id') id: string) {
  //   await this.productsService.remove(id);
  //   return createSuccessResponse({ id }, 'Product deleted successfully');
  // }
}
