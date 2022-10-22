import {
  Role,
  RolesPermissions,
  Session,
  Site,
  User,
  UsersRoles,
} from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class CreateRoleResponse implements Role {
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
export class CreateUserRolesResponse implements UsersRoles {
  @Exclude()
  userId: string;

  @Exclude()
  roleId: string;

  @Type(() => CreateRoleResponse)
  role: CreateRoleResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class CreateSiteResponse implements Site {
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

export default class UserResponse implements User {
  id: string;

  username: string;

  fullName: string;

  emailAddress: string;

  description: string | null;

  phoneNumber: string | null;

  @Type(() => CreateUserRolesResponse)
  roles: CreateUserRolesResponse[];

  @Type(() => CreateSiteResponse)
  site: CreateSiteResponse;

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
