import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SchemesRepositoryInterface } from '../domain/schemes.repository.interface';
import { CreateSchemeDto } from '../api/dto/create-scheme.dto';
import { UpdateSchemeDto } from '../api/dto/update-scheme.dto';
import { SCHEMES_REPOSITORY_TOKEN } from '../../../infrastructure/database/constants';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class SchemesService {
  constructor(
    @Inject(SCHEMES_REPOSITORY_TOKEN)
    private readonly schemesRepository: SchemesRepositoryInterface,
  ) {}

  async create(createSchemeDto: CreateSchemeDto) {
    const { fundManagerIds, top5Holdings, top5Sectors, ...schemeData } = createSchemeDto;

    // Create the scheme
    const scheme = await this.schemesRepository.create({
      ...schemeData,
      top5Holdings: top5Holdings, // Pass JSON directly
      top5Sectors: top5Sectors,
    });

    // Handle Fund Managers
    if (fundManagerIds && fundManagerIds.length > 0) {
      await this.schemesRepository.updateFundManagerHistory(scheme.id, fundManagerIds);
    }

    return this.findOne(scheme.id);
  }

  async findAll(params: PaginationQueryDto) {
    return this.schemesRepository.findAll(params);
  }

  async findOne(id: string) {
    const scheme = await this.schemesRepository.findById(id);
    if (!scheme) {
      throw new NotFoundException(`Scheme with ID ${id} not found`);
    }
    return scheme;
  }

  async update(id: string, updateSchemeDto: UpdateSchemeDto) {
    const { fundManagerIds, top5Holdings, top5Sectors, ...schemeData } = updateSchemeDto;

    // Check if exists
    await this.findOne(id);

    // Update main scheme data
    await this.schemesRepository.update(id, {
        ...schemeData,
        top5Holdings: top5Holdings,
        top5Sectors: top5Sectors
    });

    // Update Relations if provided
    if (fundManagerIds) {
      await this.schemesRepository.updateFundManagerHistory(id, fundManagerIds);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if exists
    await this.findOne(id);
    return this.schemesRepository.delete(id);
  }
}
