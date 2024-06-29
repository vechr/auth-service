import { Prisma, Permission as TPermission } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';
import { BaseEntity } from '@/core/base/domain/entities';

export class Permission extends BaseEntity implements TPermission {
  alias: string;
}

export type OptionalPermission = Partial<Permission>;
export type RequiredPermission = Required<Permission>;
export type TListPermissionRequestQuery<P> = IListRequestQuery<
  P,
  Permission,
  Prisma.PermissionWhereInput
>;
export type TGetPermissionByIdRequestParams = Pick<Permission, 'id'>;
export type TUpdatePermissionByIdRequestParams = Pick<Permission, 'id'>;
