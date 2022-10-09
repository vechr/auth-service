import { Permission, PermissionType } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class GetPermissionResponse implements Permission {
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
