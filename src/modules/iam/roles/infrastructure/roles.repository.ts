import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/infrastructure/repositories/base/base.repository';
import { roles, rolesToPermissions } from '@app/infrastructure/schemas';
import { eq, ilike, or, and, SQL, count, notInArray } from 'drizzle-orm';
import { CreateRoleDto } from '../api/dto/create-role.dto';
import { AssignPermissionsDto } from '../api/dto/assign-permissions.dto';
import {
  IRolesRepository,
  NewRole,
  Role,
} from '../domain/roles.repository.interface';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { PaginatedResponse } from '@app/shared/interfaces/core/response.type';

@Injectable()
export class RolesRepository extends BaseRepository implements IRolesRepository {
  async create(createRoleDto: CreateRoleDto) {
    const newRole: Omit<NewRole, 'id'> = {
      ...createRoleDto,
      slug: createRoleDto.name.toLowerCase().replace(/\s+/g, '-'),
    };
    const [role] = await this.db.insert(roles).values(newRole).returning();
    return role;
  }

  async findAll({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
  }: PaginationQueryDto): Promise<PaginatedResponse<Role>> {
        const whereClauses: SQL[] = [
      notInArray(roles.name, ['Admin', 'Investor', 'Distributor']),
    ];

    const offset = (page - 1) * limit;

    if (search) {
      const searchCondition = or(
        ilike(roles.name, `%${search}%`),
        ilike(roles.slug, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    const [data, total] = await Promise.all([
      this.db.query.roles.findMany({
        limit,
        offset,
        with: {
          permissions: {
            with: {
              permission: true,
            },
          },
        },
        where: and(...whereClauses),
        orderBy: (roles, { asc, desc }) => [
          orderDirection === 'asc' ? asc(roles[orderBy]) : desc(roles[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(roles)
        .where(and(...whereClauses)),
    ]);

    return {
      data,
      metaData: {
        total: total[0].value,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(total[0].value / limit),
      }
    };
  }

  async findOne(id: string) {
    return this.db.query.roles.findFirst({
      where: eq(roles.id, id),
      with: {
        permissions: {
          with: {
            permission: true,
          },
        },
      },
    });
  }

  async update(id: string, updateRoleDto: Partial<NewRole>) {
    updateRoleDto.slug = updateRoleDto.name
      ? updateRoleDto.name.toLowerCase().replace(/\s+/g, '-')
      : undefined;
    const [role] = await this.db
      .update(roles)
      .set(updateRoleDto)
      .where(eq(roles.id, id))
      .returning();
    return role;
  }

  async remove(id: string) {
    await this.db.delete(roles).where(eq(roles.id, id));
  }

  async findBySlug(slug: string) {
    return this.db.query.roles.findFirst({
      where: eq(roles.slug, slug),
    });
  }

  async assignPermissions(id: string, assignPermissionsDto: AssignPermissionsDto): Promise<void> {
    await this.db.delete(rolesToPermissions).where(eq(rolesToPermissions.roleId, id));

    if (assignPermissionsDto.permissionIds.length > 0) {
      const values = assignPermissionsDto.permissionIds.map((permissionId) => ({
        roleId: id,
        permissionId,
      }));
      await this.db.insert(rolesToPermissions).values(values);
    }
  }
}
