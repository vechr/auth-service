import { Permission } from './permission.entity';

export class ListPermissionSerializer implements Permission {
  id: string;
  name: string;
  description: string | null;

  alias: string;

  createdAt: Date;
  updatedAt: Date;
}

export class CreatePermissionSerializer implements Permission {
  id: string;
  name: string;
  description: string | null;

  alias: string;

  createdAt: Date;
  updatedAt: Date;
}

export class UpdatePermissionSerializer extends CreatePermissionSerializer {}
export class DeletePermissionSerializer extends CreatePermissionSerializer {}
export class GetPermissionSerializer extends CreatePermissionSerializer {}
export class UpsertPermissionSerializer extends CreatePermissionSerializer {}
