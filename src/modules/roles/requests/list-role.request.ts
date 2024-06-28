import { Prisma, Role } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/frameworks/shared/types/query.type';

export type TListRoleRequestQuery = IListRequestQuery<Role, Prisma.RoleWhereInput>;
