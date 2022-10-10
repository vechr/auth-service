import {
  AuditAuth,
  Role,
  RolesPermissions,
  Session,
  Site,
  User,
  UsersRoles,
} from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class UpdateRoleResponse implements Role {
  id: string;

  name: string;

  description: string | null;

  @Exclude()
  permissions: RolesPermissions;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
export class UpdateUserRolesResponse implements UsersRoles {
  @Exclude()
  userId: string;

  @Exclude()
  roleId: string;

  @Type(() => UpdateRoleResponse)
  role: UpdateRoleResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class UpdateSiteResponse implements Site {
  id: string;

  code: string;

  name: string;

  location: string;

  description: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export default class UpdateUserResponse implements User {
  id: string;

  fullName: string;

  emailAddress: string;

  description: string | null;

  phoneNumber: string | null;

  username: string;

  @Type(() => UpdateUserRolesResponse)
  roles: UpdateUserRolesResponse;

  @Type(() => UpdateSiteResponse)
  site: UpdateSiteResponse;

  @Exclude()
  sessions: Session;

  @Exclude()
  works: AuditAuth;

  @Exclude()
  siteId: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
