import { Injectable, Inject } from '@nestjs/common';
import { FundManagersRepositoryInterface } from '../domain/fund-managers.repository.interface';
import { CreateFundManagerDto, UpdateFundManagerDto } from '../api/dto/create-master.dto';
import { FUND_MANAGERS_REPOSITORY_TOKEN } from '../../../infrastructure/database/constants';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class FundManagersService {
  constructor(
    @Inject(FUND_MANAGERS_REPOSITORY_TOKEN)
    private readonly fundManagersRepository: FundManagersRepositoryInterface,
  ) {}

  async createFundManager(createFundManagerDto: CreateFundManagerDto) {
    return this.fundManagersRepository.createFundManager(createFundManagerDto);
  }

  async findAllFundManagers(params: PaginationQueryDto) {
    return this.fundManagersRepository.findAllFundManagers(params);
  }

  async findFundManagerById(id: string) {
    return this.fundManagersRepository.findFundManagerById(id);
  }

  async updateFundManager(id: string, updateFundManagerDto: UpdateFundManagerDto) {
    return this.fundManagersRepository.updateFundManager(id, updateFundManagerDto);
  }

  async deleteFundManager(id: string) {
    return this.fundManagersRepository.deleteFundManager(id);
  }
}