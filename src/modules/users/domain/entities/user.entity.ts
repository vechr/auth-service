import { Prisma, User as TUser } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';
import { BaseEntity } from '@/core/base/domain/entities';
import {
  TUserSite,
  TUsersRoles,
} from '@/core/base/domain/entities/auth.entity';

export class User extends BaseEntity implements TUser {
  siteId: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  password: string;
}

export type UserFull = TUsersRoles & User & TUserSite;

export type OptionalUser = Partial<User>;
export type RequiredUser = Required<User>;
export type TListUserRequestQuery<P> = IListRequestQuery<
  P,
  User,
  Prisma.UserWhereInput
>;
export type TCreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type TCreateUserRequestBody = TCreateUser & {
  confirmPassword: string;
  roles: string[];
};
export type TUpsertUserRequestBody = TCreateUserRequestBody;
export type TUpdateUser = Partial<TCreateUser>;
export type TUpdateUserRequestBody = Partial<TCreateUserRequestBody>;
