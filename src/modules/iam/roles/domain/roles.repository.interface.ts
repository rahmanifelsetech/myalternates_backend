import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { roles } from '@app/infrastructure/schemas/core/roles.schema';

export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;

import { CreateRoleDto } from '../api/dto/create-role.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

import { AssignPermissionsDto } from '../api/dto/assign-permissions.dto';

export interface IRolesRepository {
  create(createRoleDto: CreateRoleDto): Promise<Role>;
  findAll(
    params: PaginationQueryDto
  ): Promise<PaginatedResponse<Role>>;
  findOne(id: string): Promise<Role | undefined>;
  update(id: string, updateRoleDto: Partial<NewRole>): Promise<Role>;
  remove(id: string): Promise<void>;
  findBySlug(slug: string): Promise<Role | undefined>;
  assignPermissions(id: string, assignPermissionsDto: AssignPermissionsDto): Promise<void>;
}
