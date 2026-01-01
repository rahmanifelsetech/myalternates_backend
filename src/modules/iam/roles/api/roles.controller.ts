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
import { RolesService } from '../application/roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  createPaginatedResponse,
  createSingleResponse,
  createEmptyResponse,
} from '@app/shared/utils/response.helper';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import {
  SingleResponse,
  PaginatedResponse,
  EmptyResponse,
} from '@app/shared/interfaces/core/response.type';
import { Role } from '../domain/roles.repository.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(PERMISSIONS.ROLES.CREATE.slug)
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<SingleResponse<Role>> {
    const role = await this.rolesService.create(createRoleDto);
    return createSingleResponse(role, 'Role created successfully');
  }

  @Get()
  @Permissions(PERMISSIONS.ROLES.READ.slug)
  async findAll(
    @Query() filters: PaginationQueryDto,
  ): Promise<PaginatedResponse<Role>> {
    const result = await this.rolesService.findAll(filters);
    return createPaginatedResponse(
      result.data,
      result.metaData,
      'Roles retrieved successfully',
    );
  }

  @Get(':id')
  @Permissions(PERMISSIONS.ROLES.READ.slug)
  async findOne(@Param('id') id: string): Promise<SingleResponse<Role>> {
    const role = await this.rolesService.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return createSingleResponse(role, 'Role retrieved successfully');
  }

  @Put(':id')
  @Permissions(PERMISSIONS.ROLES.UPDATE.slug)
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<SingleResponse<Role>> {
    const role = await this.rolesService.update(id, updateRoleDto);
    return createSingleResponse(role, 'Role updated successfully');
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.ROLES.DELETE.slug)
  async remove(@Param('id') id: string): Promise<EmptyResponse> {
    await this.rolesService.remove(id);
    return createEmptyResponse('Role deleted successfully');
  }

  @Post(':id/assign-permissions')
  @Permissions(PERMISSIONS.ROLES.ASSIGN.slug)
  async assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ): Promise<EmptyResponse> {
    await this.rolesService.assignPermissions(id, assignPermissionsDto);
    return createEmptyResponse('Permissions assigned successfully');
  }
}
