import { Inject, Injectable } from '@nestjs/common';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { IPermissionsRepository } from '../domain/permissions.repository.interface';
import { CreatePermissionDto } from '../api/dto/create-permission.dto';
import { UpdatePermissionDto } from '../api/dto/update-permission.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY_TOKEN)
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.permissionsRepository.create(createPermissionDto);
  }

  async findAll(params: PaginationQueryDto) {
    return this.permissionsRepository.findAll(params);
  }

  async findOne(id: string) {
    return this.permissionsRepository.findOne(id);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsRepository.update(id, updatePermissionDto);
  }

  async remove(id: string) {
    return this.permissionsRepository.remove(id);
  }

  async findBySlug(slug: string) {
    return this.permissionsRepository.findBySlug(slug);
  }
}
