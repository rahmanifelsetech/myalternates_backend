import { Controller, Get, Post, Body, Param, Query, NotFoundException, Put, Delete } from '@nestjs/common';
import { BenchmarkIndicesService } from '../application/benchmark-indices.service';
import { CreateBenchmarkIndexDto, UpdateBenchmarkIndexDto } from './dto/create-master.dto';
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
import { BenchmarkIndex } from '../domain/benchmark-indices.repository.interface';

@ApiTags('Masters - Benchmark Indices')
@ApiBearerAuth()
@Controller('masters/benchmark-indices')
export class BenchmarkIndicesController {
  constructor(private readonly benchmarkIndicesService: BenchmarkIndicesService) {}

  @Post()
  @Permissions(PERMISSIONS.MASTERS.BENCHMARK_CREATE.slug)
  @ApiOperation({ summary: 'Create Benchmark Index' })
  async createBenchmarkIndex(
    @Body() createBenchmarkIndexDto: CreateBenchmarkIndexDto,
  ): Promise<SingleResponse<BenchmarkIndex>> {
    const index = await this.benchmarkIndicesService.createBenchmarkIndex(
      createBenchmarkIndexDto,
    );
    return createSingleResponse(index, 'Benchmark Index created successfully');
  }

  @Get()
  @Permissions(PERMISSIONS.MASTERS.BENCHMARK_READ.slug)
  @ApiOperation({ summary: 'Get All Benchmark Indices' })
  async findAllBenchmarkIndices(
    @Query() filters: PaginationQueryDto,
  ): Promise<PaginatedResponse<BenchmarkIndex>> {
    const result = await this.benchmarkIndicesService.findAllBenchmarkIndices(filters);
    return createPaginatedResponse(result.data, result.metaData, 'Benchmark indices retrieved successfully');
  }

  @Get(':id')
  @Permissions(PERMISSIONS.MASTERS.BENCHMARK_READ.slug)
  @ApiOperation({ summary: 'Get Benchmark Index by ID' })
  async findBenchmarkIndexById(
    @Param('id') id: string,
  ): Promise<SingleResponse<BenchmarkIndex>> {
    const index = await this.benchmarkIndicesService.findBenchmarkIndexById(id);
    if (!index) {
      throw new NotFoundException(`Benchmark Index with ID "${id}" not found`);
    }
    return createSingleResponse(index, 'Benchmark Index retrieved successfully');
  }

  @Put(':id')
  @Permissions(PERMISSIONS.MASTERS.BENCHMARK_UPDATE.slug)
  @ApiOperation({ summary: 'Update Benchmark Index' })
  async updateBenchmarkIndex(
    @Param('id') id: string,
    @Body() updateBenchmarkIndexDto: UpdateBenchmarkIndexDto,
  ): Promise<SingleResponse<BenchmarkIndex>> {
    const index = await this.benchmarkIndicesService.updateBenchmarkIndex(
      id,
      updateBenchmarkIndexDto,
    );
    if (!index) {
      throw new NotFoundException(`Benchmark Index with ID "${id}" not found`);
    }
    return createSingleResponse(index, 'Benchmark Index updated successfully');
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.MASTERS.BENCHMARK_DELETE.slug)
  @ApiOperation({ summary: 'Delete Benchmark Index' })
  async deleteBenchmarkIndex(@Param('id') id: string): Promise<EmptyResponse> {
    const deleted = await this.benchmarkIndicesService.deleteBenchmarkIndex(id);
    if (!deleted) {
      throw new NotFoundException(`Benchmark Index with ID "${id}" not found for deletion`);
    }
    return createEmptyResponse('Benchmark Index deleted successfully');
  }
}