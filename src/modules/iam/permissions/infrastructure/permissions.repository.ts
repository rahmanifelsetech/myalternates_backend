import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/infrastructure/repositories/base/base.repository';
import { permissions } from '@app/infrastructure/schemas';
import { eq, ilike, or, and, SQL, count } from 'drizzle-orm';
import { CreatePermissionDto } from '../api/dto/create-permission.dto';
import {
  IPermissionsRepository,
  NewPermission,
  PaginatedPermissionsResult,
  FindAllPermissionsParams,
  Permission,
} from '../domain/permissions.repository.interface';

@Injectable()
export class PermissionsRepository
  extends BaseRepository
  implements IPermissionsRepository
{
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const newPermission = {
      ...createPermissionDto,
      slug: createPermissionDto.slug,
    };
    const [permission] = await this.db
      .insert(permissions)
      .values(newPermission)
      .returning();
    return permission as Permission;
  }

  async findAll({
    limit = 500,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'asc',
    search,
  }: FindAllPermissionsParams): Promise<PaginatedPermissionsResult> {
    const offset = (page - 1) * limit;
    const whereClauses: SQL[] = [];
    console.log('Search term:', search, limit);
    if (search) {
      const searchCondition = or(
        ilike(permissions.name, `%${search}%`),
        ilike(permissions.slug, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.permissions.findMany({
        limit,
        offset,
        where: and(...whereClauses),
        orderBy: (permissions, { asc, desc }) => [
          orderDirection === 'asc'
            ? asc(permissions[orderBy])
            : desc(permissions[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(permissions)
        .where(and(...whereClauses)),
    ]);

    return {
      data,
      metaData: {
        total: total[0].value,
        page,
        limit,
        totalPages: Math.ceil(total[0].value / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.db.query.permissions.findFirst({
      where: eq(permissions.id, id),
    });
  }

  async update(id: string, updatePermissionDto: Partial<NewPermission>) {
    updatePermissionDto.slug = updatePermissionDto.name
      ? updatePermissionDto.name.toLowerCase().replace(/\s+/g, '-')
      : undefined;
    const [permission] = await this.db
      .update(permissions)
      .set(updatePermissionDto)
      .where(eq(permissions.id, id))
      .returning();
    return permission;
  }

  async remove(id: string) {
    await this.db.delete(permissions).where(eq(permissions.id, id));
  }

  async findBySlug(slug: string) {
    return this.db.query.permissions.findFirst({
      where: eq(permissions.slug, slug),
    });
  }
}
