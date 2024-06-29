import {
  Permission,
  Role as TRole,
  Site,
  User,
  RolePermission as TRolePermission,
} from '@prisma/client';
import { BaseEntity } from './base.entity';

export class AuthUser extends BaseEntity implements User {
  email: string | null;
  phoneNumber: string | null;
  fullName: string | null;
  name: string;
  password: string;
  siteId: string;
  siteCode: string;
  roles: string[];
  permissions: string[];
}
export type TCompactAuthUser = Omit<
  AuthUser,
  'createdAt' | 'updatedAt' | 'password'
>;
export type OptionalAuthUser = Partial<AuthUser>;

export type TUserSite = {
  site: Site;
};

export type TUsersRoles = {
  roles: UserRole[];
};

export type UserRole = {
  role: Role;
};

export type Role = TRole & {
  permissions: RolePermission[];
};

export type RolePermission = TRolePermission & { permission: Permission };
