import {
  users,
  roles,
  rolesToPermissions,
  permissions,
} from '@app/infrastructure/schemas';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;
export type UserWithRelations = User & {
  role:
    | (InferSelectModel<typeof roles> & {
        permissions: (InferSelectModel<typeof rolesToPermissions> & {
          permission: InferSelectModel<typeof permissions>;
        })[];
      })
    | null;
};
export type NewUser = InferInsertModel<typeof users>;
export type UpdateUser = Partial<InferInsertModel<typeof users>>;

export type PaginatedUsersResult = {
  data: UserWithRelations[];
  total: number;
  page: number;
  limit: number;
};

export type FindAllUsersParams = {
  limit?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
  role?: string;
  appType?: string;
};

export interface IUsersRepository {
  findById(id: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined>;
  findByEmail(email: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined>;
  findByPhone(phone: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined>;
  findByPan(pan: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined>;
  findByUsername(username: string, columns?: Record<string, boolean>): Promise<Partial<UserWithRelations> | undefined>;
  create(user: NewUser): Promise<User>;
  update(id: string, user: UpdateUser): Promise<User>;
  findAll(params: FindAllUsersParams): Promise<PaginatedUsersResult>;
  remove(id: string): Promise<void>;
}
