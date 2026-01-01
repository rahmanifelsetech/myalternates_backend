import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { Permissions } from '@app/shared/decorators/permissions.decorator';
import { PERMISSIONS } from '@app/shared/constants/permissions.constants';
import { PermissionsService } from '../application/permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { createPaginatedResponse, createSingleResponse, createEmptyResponse } from '@app/shared/utils/response.helper';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import {
  SingleResponse,
  PaginatedResponse,
  EmptyResponse,
} from '@app/shared/interfaces/core/response.type';
import { Permission } from '../domain/permissions.repository.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // @Post()
  // @Permissions(PERMISSIONS.PERMISSIONS.CREATE.slug)
  // async create(
  //   @Body() createPermissionDto: CreatePermissionDto,
  // ): Promise<SingleResponse<Permission>> {
  //   const permission = await this.permissionsService.create(createPermissionDto);
  //   return createSingleResponse(permission, 'Permission created successfully');
  // }

  @Get()
  @Permissions(PERMISSIONS.PERMISSIONS.READ.slug)
  async findAll(
    @Query() filters: PaginationQueryDto,
  ): Promise<PaginatedResponse<Permission>> {
    const result = await this.permissionsService.findAll(filters);
    return createPaginatedResponse(
      result.data,
      result.metaData,
      'Permissions retrieved successfully',
    );
  }

  // @Get(':id')
  // @Permissions(PERMISSIONS.PERMISSIONS.READ.slug)
  // async findOne(@Param('id') id: string): Promise<SingleResponse<Permission>> {
  //   const permission = await this.permissionsService.findOne(id);
  //   if (!permission) {
  //     throw new NotFoundException(`Permission with ID "${id}" not found`);
  //   }
  //   return createSingleResponse(permission, 'Permission retrieved successfully');
  // }

  // @Put(':id')
  // @Permissions(PERMISSIONS.PERMISSIONS.UPDATE.slug)
  // async update(
  //   @Param('id') id: string,
  //   @Body() updatePermissionDto: UpdatePermissionDto,
  // ): Promise<SingleResponse<Permission>> {
  //   const permission = await this.permissionsService.update(
  //     id,
  //     updatePermissionDto,
  //   );
  //   return createSingleResponse(permission, 'Permission updated successfully');
  // }

  // @Delete(':id')
  // @Permissions(PERMISSIONS.PERMISSIONS.DELETE.slug)
  // async remove(@Param('id') id: string): Promise<EmptyResponse> {
  //   await this.permissionsService.remove(id);
  //   return createEmptyResponse('Permission deleted successfully');
  // }
}
