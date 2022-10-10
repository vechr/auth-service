import { Injectable } from '@nestjs/common';
import { AuditAction, Site } from '@prisma/client';
import AuditAuthService from '../audits/audit.service';
import { TListSiteRequestQuery } from './requests/list-site.request';
import { IGetSiteRequestParams } from './requests/get-site.request';
import siteException from './site.exception';
import { ICreateSiteRequestBody } from './requests/create-site.request';
import {
  IUpdateSiteRequestBody,
  IUpdateSiteRequestParams,
} from './requests/update-site.request';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';

@Injectable()
export default class SiteService {
  constructor(
    private readonly db: PrismaService,
    private readonly auditAuth: AuditAuthService,
  ) {}

  public async list(ctx: IContext): Promise<{
    result: Site[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListSiteRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListSiteRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, sites] = await this.db.$transaction([
      this.db.site.count(selectOptions),
      this.db.site.findMany({ ...pageOptions, ...selectOptions }),
    ]);

    const meta = parseMeta<Site>({
      result: sites,
      total,
      page,
      limit,
    });

    return {
      result: sites,
      meta,
    };
  }

  public async get(params: IGetSiteRequestParams): Promise<Site> {
    const site = await this.db.site.findUnique({
      where: { id: params.id },
    });

    if (!site) {
      throw new siteException.SiteNotFound({ id: params.id });
    }

    return site;
  }

  public async create(
    ctx: IContext,
    body: ICreateSiteRequestBody,
  ): Promise<Site> {
    try {
      const site = await this.db.site.create({
        data: body,
      });

      this.auditAuth.sendAudit(ctx, AuditAction.CREATED, {
        id: site.id,
        incoming: site,
        auditable: 'site',
      });

      return site;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new siteException.DuplicateSite({ code: body.code });
      }

      throw error;
    }
  }

  public async update(
    ctx: IContext,
    params: IUpdateSiteRequestParams,
    body: IUpdateSiteRequestBody,
  ): Promise<Site> {
    const currentSite = await this.db.site.findUnique({
      where: { id: params.id },
    });

    if (!currentSite) {
      throw new siteException.SiteNotFound({ id: params.id });
    }

    try {
      const site = await this.db.site.upsert({
        where: { id: params.id },
        create: { ...currentSite, ...body },
        update: { ...currentSite, ...body },
      });

      this.auditAuth.sendAudit(ctx, AuditAction.UPDATED, {
        id: site.id,
        prev: currentSite,
        incoming: site,
        auditable: 'site',
      });

      return site;
    } catch (error: any) {
      if (error.code === 'P2002') {
        if (body.code)
          throw new siteException.DuplicateSite({ code: body.code });
      }

      throw error;
    }
  }

  public async delete(
    ctx: IContext,
    params: IUpdateSiteRequestParams,
  ): Promise<Site> {
    const currentSite = await this.db.site.findUnique({
      where: { id: params.id },
    });

    if (!currentSite) {
      throw new siteException.SiteNotFound({ id: params.id });
    }

    const site = await this.db.site.delete({
      where: { id: params.id },
    });

    this.auditAuth.sendAudit(ctx, AuditAction.DELETED, {
      id: site.id,
      prev: currentSite,
      auditable: 'site',
    });

    return site;
  }
}
