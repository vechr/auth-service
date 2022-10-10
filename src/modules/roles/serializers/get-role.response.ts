import {
  Permission,
  PermissionType,
  Role,
  RolesPermissions,
} from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class GetPermissionResponse implements Permission {
  id: string;

  alias: string;

  name: string;

  description: string | null;

  permissionType: PermissionType | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
export class GetRolePermissionsResponse implements RolesPermissions {
  @Exclude()
  roleId: string;

  @Exclude()
  permissionId: string;

  @Type(() => GetPermissionResponse)
  permission: GetPermissionResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
export default class GetRoleResponse implements Role {
  id: string;

  name: string;

  description: string | null;

  @Type(() => GetRolePermissionsResponse)
  permissions: GetRolePermissionsResponse[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
