import { Prisma, Site } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListSiteRequestQuery = IListRequestQuery<
  Site,
  Prisma.SiteWhereInput
>;
