import { Permission, PermissionType, Role, RolesPermissions } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class CreatePermissionResponse implements Permission {
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
export class CreateRolePermissionsResponse implements RolesPermissions {
  @Exclude()
  roleId: string;

  @Exclude()
  permissionId: string;

  @Type(() => CreatePermissionResponse)
  permission: CreatePermissionResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export default class CreateRoleResponse implements Role {
  id: string;

  name: string;

  description: string | null;

  @Type(() => CreateRolePermissionsResponse)
  permissions: CreateRolePermissionsResponse[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
