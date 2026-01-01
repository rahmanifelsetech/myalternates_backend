import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { permissions } from '@app/infrastructure/schemas/core/permissions.schema';
import { CreatePermissionDto } from '../api/dto/create-permission.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';

export type Permission = InferSelectModel<typeof permissions>;
export type NewPermission = InferInsertModel<typeof permissions>;

import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

export type PaginatedPermissionsResult = PaginatedResponse<Permission>;

export type FindAllPermissionsParams = PaginationQueryDto;

export interface IPermissionsRepository {
  create(createPermissionDto: CreatePermissionDto);
  findAll(params: FindAllPermissionsParams): Promise<PaginatedPermissionsResult>;
  findOne(id: string): Promise<Permission | undefined>;
  update(id: string, updatePermissionDto: Partial<Omit<NewPermission, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Permission>;
  remove(id: string): Promise<void>;
  findBySlug(slug: string): Promise<Permission | undefined>;
}
