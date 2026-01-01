import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { SchemeService } from '../application/scheme.service';
import { CreateSchemeDto, UpdateSchemeDto } from './dto/scheme.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import {
  createPaginatedResponse,
  createSingleResponse,
  createEmptyResponse,
} from '@app/shared/utils/response.helper';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Schemes')
@ApiBearerAuth()
@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemeService: SchemeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Scheme' })
  async create(@Body() createSchemeDto: CreateSchemeDto) {
    const scheme = await this.schemeService.create(createSchemeDto);
    return createSingleResponse(scheme, 'Scheme created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all Schemes' })
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    const schemes = await this.schemeService.findAll(paginationQueryDto);
    return createPaginatedResponse(
      schemes.data,
      schemes.metaData,
      'Schemes retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Scheme by ID' })
  async findById(@Param('id') id: string) {
    const scheme = await this.schemeService.findById(id);
    if (!scheme) {
      throw new NotFoundException(`Scheme with ID "${id}" not found`);
    }
    return createSingleResponse(scheme, 'Scheme retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Scheme' })
  async update(
    @Param('id') id: string,
    @Body() updateSchemeDto: UpdateSchemeDto,
  ) {
    const scheme = await this.schemeService.update(id, updateSchemeDto);
    if (!scheme) {
      throw new NotFoundException(`Scheme with ID "${id}" not found`);
    }
    return createSingleResponse(scheme, 'Scheme updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Scheme' })
  async delete(@Param('id') id: string) {
    const deleted = await this.schemeService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Scheme with ID "${id}" not found`);
    }
    return createEmptyResponse('Scheme deleted successfully');
  }
}
