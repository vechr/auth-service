import { Permission, PermissionType, Role, RolesPermissions } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class DeletePermissionResponse implements Permission {
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
export class DeleteRolePermissionsResponse implements RolesPermissions {
  @Exclude()
  roleId: string;

  @Exclude()
  permissionId: string;

  @Type(() => DeletePermissionResponse)
  permission: DeletePermissionResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
export default class DeleteRoleResponse implements Role {
  id: string;

  name: string;

  description: string | null;

  @Type(() => DeleteRolePermissionsResponse)
  permissions: DeleteRolePermissionsResponse[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
