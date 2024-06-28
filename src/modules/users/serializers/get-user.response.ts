import { Role, RolesPermissions, Session, Site, User, UsersRoles } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class GetRoleResponse implements Role {
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
export class GetUserRolesResponse implements UsersRoles {
  @Exclude()
  userId: string;

  @Exclude()
  roleId: string;

  @Type(() => GetRoleResponse)
  role: GetRoleResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class GetSiteResponse implements Site {
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

export default class GetUserResponse implements User {
  id: string;

  username: string;

  fullName: string;

  emailAddress: string;

  description: string | null;

  phoneNumber: string | null;

  @Type(() => GetUserRolesResponse)
  roles: GetUserRolesResponse;

  @Type(() => GetSiteResponse)
  site: GetSiteResponse;

  @Exclude()
  sessions: Session;

  @Exclude()
  siteId: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
