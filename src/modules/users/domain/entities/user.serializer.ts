import { Exclude } from 'class-transformer';
import { User } from './user.entity';

export class ListUserSerializer implements User {
  id: string;
  name: string;
  description: string | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  siteId: string;

  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateUserSerializer implements User {
  id: string;
  name: string;
  description: string | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  siteId: string;

  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateUserSerializer extends CreateUserSerializer {}
export class DeleteUserSerializer extends CreateUserSerializer {}
export class GetUserSerializer extends CreateUserSerializer {}
export class UpsertUserSerializer extends CreateUserSerializer {}
