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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AmcService } from '../application/amc.service';
import { CreateAmcDto, UpdateAmcDto } from './dto/amc.dto';
import { ActiveUser } from '@app/shared/decorators/active-user.decorator';
import { UserWithRelations } from '@app/modules/iam/users/domain/users.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import {
  createPaginatedResponse,
  createSingleResponse,
  createEmptyResponse,
} from '@app/shared/utils/response.helper';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AMCs')
@ApiBearerAuth()
@Controller('amcs')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Create a new AMC' })
  async create(
    @ActiveUser() user: UserWithRelations,
    @Body() createAmcDto: CreateAmcDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    console.log('CreateAmcDto:', createAmcDto);
    console.log('logo:', logo);
    const amc = await this.amcService.create(createAmcDto, logo, user);
    return createSingleResponse(amc, 'AMC created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all AMCs' })
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    const amcs = await this.amcService.findAll(paginationQueryDto);
    return createPaginatedResponse(
      amcs.data,
      amcs.metaData,
      'AMCs retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an AMC by ID' })
  async findById(@Param('id') id: string) {
    const amc = await this.amcService.findById(id);
    if (!amc) {
      throw new NotFoundException(`AMC with ID "${id}" not found`);
    }
    return createSingleResponse(amc, 'AMC retrieved successfully');
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Update an AMC' })
  async update(
    @Param('id') id: string,
    @Body() updateAmcDto: UpdateAmcDto,
    @UploadedFile() logo: Express.Multer.File,
    @ActiveUser() user: UserWithRelations,
  ) {
    const amc = await this.amcService.update(id, updateAmcDto, logo, user);
    if (!amc) {
      throw new NotFoundException(`AMC with ID "${id}" not found`);
    }
    return createSingleResponse(amc, 'AMC updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an AMC' })
  async delete(@Param('id') id: string) {
    const deleted = await this.amcService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`AMC with ID "${id}" not found`);
    }
    return createEmptyResponse('AMC deleted successfully');
  }
}