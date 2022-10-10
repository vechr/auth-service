import {
  Permission,
  PermissionType,
  Role,
  RolesPermissions,
} from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class UpdatePermissionResponse implements Permission {
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
export class UpdateRolePermissionsResponse implements RolesPermissions {
  @Exclude()
  roleId: string;

  @Exclude()
  permissionId: string;

  @Type(() => UpdatePermissionResponse)
  permission: UpdatePermissionResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export default class UpdateRoleResponse implements Role {
  id: string;

  name: string;

  description: string | null;

  @Type(() => UpdateRolePermissionsResponse)
  permissions: UpdateRolePermissionsResponse[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
