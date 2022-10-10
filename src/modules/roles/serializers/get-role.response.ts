import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class GetRoleResponse implements Role {
  id: string;

  name: string;

  description: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
