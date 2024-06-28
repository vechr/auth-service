import { HttpStatus, Injectable } from '@nestjs/common';
import { Site } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import AuditService from '../audits/audit.service';
import { AuditAction } from '../audits/types/audit-enum.type';
import { TListSiteRequestQuery } from './requests/list-site.request';
import { IGetSiteRequestParams } from './requests/get-site.request';
import siteException from './site.exception';
import { ICreateSiteRequestBody } from './requests/create-site.request';
import { IUpdateSiteRequestBody, IUpdateSiteRequestParams } from './requests/update-site.request';
import PrismaService from '@/core/base/frameworks/data-services/prisma.service';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@utils/query.util';
import log from '@utils/log.util';
import { UnknownException } from '@/core/base/frameworks/shared/exceptions/common.exception';
import { Auditable } from '@/core/base/frameworks/shared/types/auditable.type';

@Injectable()
export default class SiteService {
  constructor(
    private readonly db: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  public async list(ctx: IContext): Promise<{
    result: Site[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListSiteRequestQuery;

    const { limit, offset, order, page } = parseQuery<TListSiteRequestQuery>(query);

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

  async getSiteAll(): Promise<Site[]> {
    try {
      const result = await this.db.site.findMany();
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
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

  public async create(ctx: IContext, body: ICreateSiteRequestBody): Promise<Site> {
    try {
      const site = await this.db.site.create({
        data: body,
      });

      this.auditService.sendAudit(ctx, AuditAction.CREATED, {
        id: site.id,
        incoming: site,
        auditable: Auditable.SITE,
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

      this.auditService.sendAudit(ctx, AuditAction.UPDATED, {
        id: site.id,
        prev: currentSite,
        incoming: site,
        auditable: Auditable.SITE,
      });

      return site;
    } catch (error: any) {
      if (error.code === 'P2002') {
        if (body.code) throw new siteException.DuplicateSite({ code: body.code });
      }

      throw error;
    }
  }

  public async delete(ctx: IContext, params: IUpdateSiteRequestParams): Promise<Site> {
    const currentSite = await this.db.site.findUnique({
      where: { id: params.id },
    });

    if (!currentSite) {
      throw new siteException.SiteNotFound({ id: params.id });
    }

    const site = await this.db.site.delete({
      where: { id: params.id },
    });

    this.auditService.sendAudit(ctx, AuditAction.DELETED, {
      id: site.id,
      prev: currentSite,
      auditable: Auditable.SITE,
    });

    return site;
  }
}
