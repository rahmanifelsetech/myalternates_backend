import { Injectable, Inject } from '@nestjs/common';
import { SchemeRepositoryInterface, SCHEME_REPOSITORY_TOKEN } from '../domain/scheme.repository.interface';
import { CreateSchemeDto, UpdateSchemeDto } from '../api/dto/scheme.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class SchemeService {
  constructor(
    @Inject(SCHEME_REPOSITORY_TOKEN)
    private readonly schemeRepository: SchemeRepositoryInterface,
  ) {}

  async create(createSchemeDto: CreateSchemeDto) {
    return this.schemeRepository.create(createSchemeDto);
  }

  async findAll(params: PaginationQueryDto) {
    return this.schemeRepository.findAll(params);
  }

  async findById(id: string) {
    return this.schemeRepository.findById(id);
  }

  async update(id: string, updateSchemeDto: UpdateSchemeDto) {
    return this.schemeRepository.update(id, updateSchemeDto);
  }

  async delete(id: string) {
    return this.schemeRepository.delete(id);
  }
}