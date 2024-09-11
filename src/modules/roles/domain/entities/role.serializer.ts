import { Role } from './role.entity';

export class ListRoleSerializer implements Role {
  id: string;
  name: string;
  description: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export class CreateRoleSerializer implements Role {
  id: string;
  name: string;
  description: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRoleSerializer extends CreateRoleSerializer {}
export class DeleteRoleSerializer extends CreateRoleSerializer {}
export class GetRoleSerializer extends CreateRoleSerializer {}
export class UpsertRoleSerializer extends CreateRoleSerializer {}
