import { Prisma, Permission } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/frameworks/shared/types/query.type';

export type TListPermissionRequestQuery = IListRequestQuery<
  Permission,
  Prisma.PermissionWhereInput
>;
