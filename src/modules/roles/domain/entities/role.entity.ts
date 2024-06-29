import { Prisma, Role as TRole } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';
import { BaseEntity } from '@/core/base/domain/entities';

export class Role extends BaseEntity implements TRole {}

export type OptionalRole = Partial<Role>;
export type RequiredRole = Required<Role>;
export type TListRoleRequestQuery<P> = IListRequestQuery<
  P,
  Role,
  Prisma.RoleWhereInput
>;
export type TGetRoleByIdRequestParams = Pick<Role, 'id'>;
export type TUpdateRoleByIdRequestParams = Pick<Role, 'id'>;
export type TDeleteRoleByIdRequestParams = Pick<Role, 'id'>;
export type TCreateRole = Omit<Role, 'id' | 'createdAt' | 'updatedAt'>;
export type TCreateRoleRequestBody = TCreateRole & {
  permissions: string[];
};
export type TUpsertRoleRequestBody = TCreateRoleRequestBody;
export type TUpdateRoleRequestBody = Partial<TCreateRoleRequestBody>;
