import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/infrastructure/repositories/base/base.repository';
import { roles, users, distributors, investors } from '@app/infrastructure/schemas';
import { eq, ilike, or, and, SQL, count, notInArray } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';
import {
  IUsersRepository,
  NewUser,
  UpdateUser,
  User,
  UserWithRelations,
  PaginatedUsersResult,
  FindAllUsersParams,
} from '../domain/users.repository.interface';

@Injectable()
export class UsersRepository
  extends BaseRepository
  implements IUsersRepository
{
  async create(user: NewUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async update(id: string, user: UpdateUser): Promise<User> {
    const result = await this.db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return result[0] as User;
  }

  async findByEmail(email: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined> {
    const result = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      columns: columns || {
        id: true, email: true, password: true, firstName: true, lastName: true,
        phone: true, isActive: true, requiresPasswordChange: true, appType: true, lastLoginAt: true,
        roleId: true,
      },
      with: {
        role: {
          with: {
            permissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });
    return result as Partial<UserWithRelations> | undefined;
  }

  async findByUsername(
    username: string,
    columns?: Record<string, boolean>
  ): Promise<Partial<UserWithRelations> | undefined> {
    const result = await this.db.query.users.findFirst({
      where: eq(users.username, username),
      columns: columns || {
        id: true, email: true, password: true, firstName: true, lastName: true,
        phone: true, isActive: true, requiresPasswordChange: true, appType: true, lastLoginAt: true,
        roleId: true,
      },
      with: {
        role: {
          with: {
            permissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });
    return result as Partial<UserWithRelations> | undefined;
  }

  async findByPhone(phone: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined> {
    const result = await this.db.query.users.findFirst({
      where: eq(users.phone, phone),
      columns: columns || {
        id: true, email: true, password: true, firstName: true, lastName: true,
        phone: true, isActive: true, requiresPasswordChange: true, appType: true, lastLoginAt: true,
        roleId: true,
      },
      with: {
        role: {
          with: {
            permissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });
    return result as Partial<UserWithRelations> | undefined;
  }

  async findByPan(pan: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined> {
    const distributor = await this.db.query.distributors.findFirst({
      where: eq(distributors.panNo, pan),
      columns: {
        userId: true,
      },
    });

    if (distributor && distributor.userId) {
      return this.findById(distributor.userId, columns);
    }

    const investor = await this.db.query.investors.findFirst({
      where: eq(investors.pan, pan),
      columns: {
        email: true,
      },
    });

    if (investor && investor.email) {
      return this.findByEmail(investor.email, columns);
    }

    return undefined;
  }

  async findById(id: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined> {
    const result = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: columns || {
        id: true, email: true, password: true, firstName: true, lastName: true,
        phone: true, isActive: true, requiresPasswordChange: true, appType: true, lastLoginAt: true,
        roleId: true,
      },
      with: {
        role: {
          with: {
            permissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });
    return result as Partial<UserWithRelations> | undefined;
  }

  async findAll({
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    search,
    role,
    appType,
  }: FindAllUsersParams): Promise<PaginatedUsersResult> {
    const offset = (page - 1) * limit;
    const systemRoles = await this.db.query.roles.findMany({
      where: or(
        eq(roles.name, 'Admin'),
        eq(roles.name, 'Investor'),
        eq(roles.name, 'Distributor'),
      ),
      columns: { id: true },
    });
    const systemRoleIds = systemRoles.map((role) => role.id); 
    const whereClauses: SQL[] = [
      notInArray(users.roleId, systemRoleIds),
    ];

    if (search) {
      const searchCondition = or(
        ilike(users.email, `%${search}%`),
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`),
      );
      if (searchCondition) {
        whereClauses.push(searchCondition);
      }
    }

    if (role) {
      whereClauses.push(eq(users.roleId, role));
    }

    if (appType) {
      whereClauses.push(eq(users.appType, appType as any));
    }

    const [data, total] = await Promise.all([
      this.db.query.users.findMany({
        limit,
        offset,
        with: {
          role: {
            with: {
              permissions: {
                with: {
                  permission: true,
                },
              },
            },
          },
        },
        where: and(...whereClauses),
        orderBy: (users, { asc, desc }) => [
          orderDirection === 'asc' ? asc(users[orderBy]) : desc(users[orderBy]),
        ],
      }),
      this.db
        .select({ value: count() })
        .from(users)
        .where(and(...whereClauses)),
    ]);

    return {
      data: data as UserWithRelations[],
      total: total[0].value,
      page,
      limit,
    };
  }

  async remove(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
