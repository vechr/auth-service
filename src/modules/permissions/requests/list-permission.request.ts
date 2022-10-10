import { Prisma, Permission } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListPermissionRequestQuery = IListRequestQuery<
  Permission,
  Prisma.PermissionWhereInput
>;
