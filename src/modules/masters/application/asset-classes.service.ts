import { Injectable, Inject } from '@nestjs/common';
import { AssetClassesRepositoryInterface } from '../domain/asset-classes.repository.interface';
import { CreateAssetClassDto, UpdateAssetClassDto } from '../api/dto/create-master.dto';
import { ASSET_CLASSES_REPOSITORY_TOKEN } from '../../../infrastructure/database/constants';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class AssetClassesService {
  constructor(
    @Inject(ASSET_CLASSES_REPOSITORY_TOKEN)
    private readonly assetClassesRepository: AssetClassesRepositoryInterface,
  ) {}

  async createAssetClass(createAssetClassDto: CreateAssetClassDto) {
    return this.assetClassesRepository.createAssetClass(createAssetClassDto);
  }

  async findAllAssetClasses(params: PaginationQueryDto) {
    return this.assetClassesRepository.findAllAssetClasses(params);
  }

  async findAssetClassById(id: string) {
    return this.assetClassesRepository.findAssetClassById(id);
  }

  async updateAssetClass(id: string, updateAssetClassDto: UpdateAssetClassDto) {
    return this.assetClassesRepository.updateAssetClass(id, updateAssetClassDto);
  }

  async deleteAssetClass(id: string) {
    return this.assetClassesRepository.deleteAssetClass(id);
  }
}