import { Controller, Get, Post, Body, Param, Query, NotFoundException, Put, Delete } from '@nestjs/common';
import { FundManagersService } from '../application/fund-managers.service';
import { CreateFundManagerDto, UpdateFundManagerDto } from './dto/create-master.dto';
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
import { FundManager } from '../domain/fund-managers.repository.interface';

@ApiTags('Masters - Fund Managers')
@ApiBearerAuth()
@Controller('masters/fund-managers')
export class FundManagersController {
  constructor(private readonly fundManagersService: FundManagersService) {}

  @Post()
  @Permissions(PERMISSIONS.MASTERS.FUND_MANAGER_CREATE.slug)
  @ApiOperation({ summary: 'Create Fund Manager' })
  async createFundManager(
    @Body() createFundManagerDto: CreateFundManagerDto,
  ): Promise<SingleResponse<FundManager>> {
    const manager = await this.fundManagersService.createFundManager(
      createFundManagerDto,
    );
    return createSingleResponse(manager, 'Fund Manager created successfully');
  }

  @Get()
  @Permissions(PERMISSIONS.MASTERS.FUND_MANAGER_READ.slug)
  @ApiOperation({ summary: 'Get All Fund Managers' })
  async findAllFundManagers(
    @Query() filters: PaginationQueryDto,
  ): Promise<PaginatedResponse<FundManager>> {
    const result = await this.fundManagersService.findAllFundManagers(filters);
    return createPaginatedResponse(result.data, result.metaData, 'Fund managers retrieved successfully');
  }

  @Get(':id')
  @Permissions(PERMISSIONS.MASTERS.FUND_MANAGER_READ.slug)
  @ApiOperation({ summary: 'Get Fund Manager by ID' })
  async findFundManagerById(
    @Param('id') id: string,
  ): Promise<SingleResponse<FundManager>> {
    const manager = await this.fundManagersService.findFundManagerById(id);
    if (!manager) {
      throw new NotFoundException(`Fund Manager with ID "${id}" not found`);
    }
    return createSingleResponse(manager, 'Fund Manager retrieved successfully');
  }

  @Put(':id')
  @Permissions(PERMISSIONS.MASTERS.FUND_MANAGER_UPDATE.slug)
  @ApiOperation({ summary: 'Update Fund Manager' })
  async updateFundManager(
    @Param('id') id: string,
    @Body() updateFundManagerDto: UpdateFundManagerDto,
  ): Promise<SingleResponse<FundManager>> {
    const manager = await this.fundManagersService.updateFundManager(
      id,
      updateFundManagerDto,
    );
    if (!manager) {
      throw new NotFoundException(`Fund Manager with ID "${id}" not found`);
    }
    return createSingleResponse(manager, 'Fund Manager updated successfully');
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.MASTERS.FUND_MANAGER_DELETE.slug)
  @ApiOperation({ summary: 'Delete Fund Manager' })
  async deleteFundManager(@Param('id') id: string): Promise<EmptyResponse> {
    const deleted = await this.fundManagersService.deleteFundManager(id);
    if (!deleted) {
      throw new NotFoundException(`Fund Manager with ID "${id}" not found for deletion`);
    }
    return createEmptyResponse('Fund Manager deleted successfully');
  }
}