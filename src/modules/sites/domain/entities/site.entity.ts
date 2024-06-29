import { Prisma, Site as TSite } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';
import { BaseEntity } from '@/core/base/domain/entities';

export class Site extends BaseEntity implements TSite {
  code: string;
  location: string;
}

export type OptionalSite = Partial<Site>;
export type RequiredSite = Required<Site>;
export type TListSiteRequestQuery<P> = IListRequestQuery<
  P,
  Site,
  Prisma.SiteWhereInput
>;
export type TGetSiteByIdRequestParams = Pick<Site, 'id'>;
export type TUpdateSiteByIdRequestParams = Pick<Site, 'id'>;
export type TDeleteSiteByIdRequestParams = Pick<Site, 'id'>;
export type TCreateSiteRequestBody = Omit<
  Site,
  'id' | 'createdAt' | 'updatedAt'
>;
export type TUpsertSiteRequestBody = TCreateSiteRequestBody;
export type TUpdateSiteRequestBody = Partial<TCreateSiteRequestBody>;
