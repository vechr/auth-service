import { Prisma, User } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/frameworks/shared/types/query.type';

export type TListUserRequestQuery = IListRequestQuery<User, Prisma.UserWhereInput>;
