import { Inject, Injectable } from '@nestjs/common';
import { ROLES_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { IRolesRepository } from '../domain/roles.repository.interface';
import { CreateRoleDto } from '../api/dto/create-role.dto';
import { UpdateRoleDto } from '../api/dto/update-role.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { AssignPermissionsDto } from '../api/dto/assign-permissions.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLES_REPOSITORY_TOKEN)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.create(createRoleDto);
  }

  async findAll(
    params: PaginationQueryDto,
  ) {
    return this.rolesRepository.findAll(params);
  }

  async findOne(id: string) {
    return this.rolesRepository.findOne(id);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.update(id, updateRoleDto);
  }

  async remove(id: string) {
    return this.rolesRepository.remove(id);
  }

  async findBySlug(slug: string) {
    return this.rolesRepository.findBySlug(slug);
  }

  async assignPermissions(id: string, assignPermissionsDto: AssignPermissionsDto) {
    return this.rolesRepository.assignPermissions(id, assignPermissionsDto);
  }
}
