import { Injectable } from '@nestjs/common';
import { AuditAction, Role } from '@prisma/client';
import AuditAuthService from '../audits/audit.service';
import { TListRoleRequestQuery } from './requests/list-role.request';
import roleException from './role.exception';
import { IGetRoleRequestParams } from './requests/get-role.request';
import { ICreateRoleRequestBody } from './requests/create-role.request';
import {
  IUpdateRoleRequestBody,
  IUpdateRoleRequestParams,
} from './requests/update-role.request';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';

@Injectable()
export default class RoleService {
  constructor(
    private readonly db: PrismaService,
    private readonly auditAuth: AuditAuthService,
  ) {}

  public async list(ctx: IContext): Promise<{
    result: Role[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListRoleRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListRoleRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, roles] = await this.db.$transaction([
      this.db.role.count(selectOptions),
      this.db.role.findMany({ ...pageOptions, ...selectOptions }),
    ]);

    const meta = parseMeta<Role>({
      result: roles,
      total,
      page,
      limit,
    });

    return {
      result: roles,
      meta,
    };
  }

  public async get(params: IGetRoleRequestParams): Promise<Role> {
    const role = await this.db.role.findUnique({
      where: { id: params.id },
    });

    if (!role) {
      throw new roleException.RoleNotFound({ id: params.id });
    }

    return role;
  }

  public async create(
    ctx: IContext,
    body: ICreateRoleRequestBody,
  ): Promise<Role> {
    try {
      const role = await this.db.role.create({
        data: body,
      });

      this.auditAuth.sendAudit(ctx, AuditAction.CREATED, {
        id: role.id,
        incoming: role,
        auditable: 'role',
      });

      return role;
    } catch (error: any) {
      if (error.code === 'P0002') {
        throw new roleException.DuplicateRole({ name: body.name });
      }

      throw error;
    }
  }

  public async update(
    ctx: IContext,
    params: IUpdateRoleRequestParams,
    body: IUpdateRoleRequestBody,
  ): Promise<Role> {
    const currentRole = await this.db.role.findUnique({
      where: { id: params.id },
    });

    if (!currentRole) {
      throw new roleException.RoleNotFound({ id: params.id });
    }

    try {
      const role = await this.db.role.upsert({
        where: { id: params.id },
        create: { ...currentRole, ...body },
        update: { ...currentRole, ...body },
      });

      this.auditAuth.sendAudit(ctx, AuditAction.UPDATED, {
        id: role.id,
        prev: currentRole,
        incoming: role,
        auditable: 'role',
      });

      return role;
    } catch (error: any) {
      if (error.code === 'P2002') {
        if (body.name)
          throw new roleException.DuplicateRole({ name: body.name });
      }

      throw error;
    }
  }

  public async delete(
    ctx: IContext,
    params: IUpdateRoleRequestParams,
  ): Promise<Role> {
    const currentRole = await this.db.role.findUnique({
      where: { id: params.id },
    });

    if (!currentRole) {
      throw new roleException.RoleNotFound({ id: params.id });
    }

    const role = await this.db.role.delete({
      where: { id: params.id },
    });

    this.auditAuth.sendAudit(ctx, AuditAction.DELETED, {
      id: role.id,
      prev: currentRole,
      auditable: 'role',
    });

    return role;
  }
}
