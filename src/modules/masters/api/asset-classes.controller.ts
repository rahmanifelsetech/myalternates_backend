import { Controller, Get, Post, Body, Param, Query, NotFoundException, Put, Delete } from '@nestjs/common';
import { AssetClassesService } from '../application/asset-classes.service';
import { CreateAssetClassDto, UpdateAssetClassDto } from './dto/create-master.dto';
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
import { AssetClass } from '../domain/asset-classes.repository.interface';

@ApiTags('Masters - Asset Classes')
@ApiBearerAuth()
@Controller('masters/asset-classes')
export class AssetClassesController {
  constructor(private readonly assetClassesService: AssetClassesService) {}

  @Post()
  @Permissions(PERMISSIONS.MASTERS.ASSET_CLASS_CREATE.slug)
  @ApiOperation({ summary: 'Create Asset Class' })
  async createAssetClass(
    @Body() createAssetClassDto: CreateAssetClassDto,
  ): Promise<SingleResponse<AssetClass>> {
    const assetClass = await this.assetClassesService.createAssetClass(createAssetClassDto);
    return createSingleResponse(assetClass, 'Asset Class created successfully');
  }

  @Get()
  @Permissions(PERMISSIONS.MASTERS.ASSET_CLASS_READ.slug)
  @ApiOperation({ summary: 'Get All Asset Classes' })
  async findAllAssetClasses(
    @Query() filters: PaginationQueryDto,
  ): Promise<PaginatedResponse<AssetClass>> {
    const result = await this.assetClassesService.findAllAssetClasses(filters);
    return createPaginatedResponse(result.data, result.metaData, 'Asset classes retrieved successfully');
  }

  @Get(':id')
  @Permissions(PERMISSIONS.MASTERS.ASSET_CLASS_READ.slug)
  @ApiOperation({ summary: 'Get Asset Class by ID' })
  async findAssetClassById(
    @Param('id') id: string,
  ): Promise<SingleResponse<AssetClass>> {
    const assetClass = await this.assetClassesService.findAssetClassById(id);
    if (!assetClass) {
      throw new NotFoundException(`Asset Class with ID "${id}" not found`);
    }
    return createSingleResponse(assetClass, 'Asset Class retrieved successfully');
  }

  @Put(':id')
  @Permissions(PERMISSIONS.MASTERS.ASSET_CLASS_UPDATE?.slug)
  @ApiOperation({ summary: 'Update Asset Class' })
  async updateAssetClass(
    @Param('id') id: string,
    @Body() updateAssetClassDto: UpdateAssetClassDto,
  ): Promise<SingleResponse<AssetClass>> {
    const assetClass = await this.assetClassesService.updateAssetClass(id, updateAssetClassDto);
    if (!assetClass) {
      throw new NotFoundException(`Asset Class with ID "${id}" not found`);
    }
    return createSingleResponse(assetClass, 'Asset Class updated successfully');
  }
  
  @Delete(':id')
  @Permissions(PERMISSIONS.MASTERS.ASSET_CLASS_DELETE?.slug)
  @ApiOperation({ summary: 'Delete Asset Class' })
  async deleteAssetClass(@Param('id') id: string): Promise<EmptyResponse> {
    const deleted = await this.assetClassesService.deleteAssetClass(id);
    if (!deleted) {
      throw new NotFoundException(`Asset Class with ID "${id}" not found for deletion`);
    }
    return createEmptyResponse('Asset Class deleted successfully');
  }
}