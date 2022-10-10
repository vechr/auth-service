import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';

import { IContext } from '@shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@shared/utils/query.util';

import { TListPermissionRequestQuery } from './requests/list-permission.request';
import permissionException from './permission.exception';
import { GetPermissionParamsValidator } from './validators/get-permission.validator';
import PrismaService from '@/prisma/prisma.service';

@Injectable()
export default class PermissionService {
  constructor(private readonly db: PrismaService) {}

  public async list(ctx: IContext): Promise<{
    result: Permission[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListPermissionRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListPermissionRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, permissions] = await this.db.$transaction([
      this.db.permission.count(selectOptions),
      this.db.permission.findMany({ ...pageOptions, ...selectOptions }),
    ]);

    const meta = parseMeta<Permission>({
      result: permissions,
      total,
      page,
      limit,
    });

    return {
      result: permissions,
      meta,
    };
  }

  public async get(
    ctx: IContext,
    params: GetPermissionParamsValidator,
  ): Promise<Permission> {
    const permission = await this.db.permission.findUnique({
      where: { id: params.id },
    });

    if (!permission) {
      throw new permissionException.PermissionNotFound({ id: params.id });
    }

    return permission;
  }
}
