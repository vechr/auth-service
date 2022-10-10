import { Prisma, AuditAuth } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListAuditAuthRequestQuery = IListRequestQuery<
  AuditAuth,
  Prisma.RoleWhereInput
>;
