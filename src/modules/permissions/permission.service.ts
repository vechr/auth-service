import { HttpStatus, Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';

import { IContext } from '@shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@shared/utils/query.util';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { TListPermissionRequestQuery } from './requests/list-permission.request';
import permissionException from './permission.exception';
import { GetPermissionParamsValidator } from './validators/get-permission.validator';
import PrismaService from '@/prisma/prisma.service';
import log from '@/shared/utils/log.util';
import { UnknownException } from '@/shared/exceptions/common.exception';

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

  async getPermissionAll(): Promise<Permission[]> {
    try {
      const result = await this.db.permission.findMany();
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
