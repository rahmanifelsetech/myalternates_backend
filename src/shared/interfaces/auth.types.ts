import { Request } from 'express';
import { UserWithRelations } from '@app/modules/iam/users/domain/users.repository.interface';

export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: UserWithRelations;
}

export interface PublicUser {
  id: string;
  email: string | null;
  name: string;
  role: string | undefined;
  appType: string | null;
  permissions: string[] | undefined;
  phone: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  requiresPasswordChange: boolean;
}
