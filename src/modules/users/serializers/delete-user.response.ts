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

export class DeleteRoleResponse implements Role {
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
export class DeleteUserRolesResponse implements UsersRoles {
  @Exclude()
  userId: string;

  @Exclude()
  roleId: string;

  @Type(() => DeleteRoleResponse)
  role: DeleteRoleResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class DeleteSiteResponse implements Site {
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

export default class DeleteUserResponse implements User {
  id: string;

  username: string;

  fullName: string;

  emailAddress: string;

  description: string | null;

  phoneNumber: string | null;

  @Type(() => DeleteUserRolesResponse)
  roles: DeleteUserRolesResponse;

  @Type(() => DeleteSiteResponse)
  site: DeleteSiteResponse;

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
