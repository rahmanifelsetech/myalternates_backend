import { Injectable, Inject } from '@nestjs/common';
import { BenchmarkIndicesRepositoryInterface } from '../domain/benchmark-indices.repository.interface';
import { CreateBenchmarkIndexDto, UpdateBenchmarkIndexDto } from '../api/dto/create-master.dto';
import { BENCHMARK_INDICES_REPOSITORY_TOKEN } from '../../../infrastructure/database/constants';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class BenchmarkIndicesService {
  constructor(
    @Inject(BENCHMARK_INDICES_REPOSITORY_TOKEN)
    private readonly benchmarkIndicesRepository: BenchmarkIndicesRepositoryInterface,
  ) {}

  async createBenchmarkIndex(createBenchmarkIndexDto: CreateBenchmarkIndexDto) {
    return this.benchmarkIndicesRepository.createBenchmarkIndex(createBenchmarkIndexDto);
  }

  async findAllBenchmarkIndices(params: PaginationQueryDto) {
    return this.benchmarkIndicesRepository.findAllBenchmarkIndices(params);
  }

  async findBenchmarkIndexById(id: string) {
    return this.benchmarkIndicesRepository.findBenchmarkIndexById(id);
  }

  async updateBenchmarkIndex(id: string, updateBenchmarkIndexDto: UpdateBenchmarkIndexDto) {
    return this.benchmarkIndicesRepository.updateBenchmarkIndex(id, updateBenchmarkIndexDto);
  }

  async deleteBenchmarkIndex(id: string) {
    return this.benchmarkIndicesRepository.deleteBenchmarkIndex(id);
  }
}