import { Prisma, User } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListUserRequestQuery = IListRequestQuery<
  User,
  Prisma.UserWhereInput
>;
