import { HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuditAction } from '../audits/types/audit-enum.type';
import AuditService from '../audits/audit.service';
import { TListRoleRequestQuery } from './requests/list-role.request';
import roleException from './role.exception';
import { IGetRoleRequestParams } from './requests/get-role.request';
import { ICreateRoleRequestBody } from './requests/create-role.request';
import { IUpdateRoleRequestBody, IUpdateRoleRequestParams } from './requests/update-role.request';
import PrismaService from '@/core/base/frameworks/data-services/prisma.service';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@shared/utils/query.util';
import log from '@utils/log.util';
import { UnknownException } from '@/core/base/frameworks/shared/exceptions/common.exception';
import { Auditable } from '@/core/base/frameworks/shared/types/auditable.type';

@Injectable()
export default class RoleService {
  constructor(
    private readonly db: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  public async list(ctx: IContext): Promise<{
    result: Role[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListRoleRequestQuery;

    const { limit, offset, order, page } = parseQuery<TListRoleRequestQuery>(query);

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

  async getRoleAll(): Promise<Role[]> {
    try {
      const result = await this.db.role.findMany();
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

  public async get(params: IGetRoleRequestParams): Promise<Role> {
    const role = await this.db.role.findUnique({
      where: { id: params.id },
      include: this.includes(),
    });

    if (!role) {
      throw new roleException.RoleNotFound({ id: params.id });
    }

    return role;
  }

  public async create(
    ctx: IContext,
    { name, permissions, description }: ICreateRoleRequestBody,
  ): Promise<Role> {
    try {
      const role = await this.db.role.create({
        data: {
          name,
          description,
          permissions: {
            create: permissions.map((permission) => ({
              permission: { connect: { id: permission } },
            })),
          },
        },
        include: this.includes(),
      });

      this.auditService.sendAudit(ctx, AuditAction.CREATED, {
        id: role.id,
        incoming: role,
        auditable: Auditable.ROLE,
      });

      return role;
    } catch (error: any) {
      if (error.code === 'P0002') {
        throw new roleException.DuplicateRole({ name });
      }

      throw error;
    }
  }

  public async update(
    ctx: IContext,
    params: IUpdateRoleRequestParams,
    { name, description, permissions }: IUpdateRoleRequestBody,
  ): Promise<Role> {
    const currentRole = await this.db.role.findUnique({
      where: { id: params.id },
      include: this.includes(),
    });

    if (!currentRole) {
      throw new roleException.RoleNotFound({ id: params.id });
    }

    try {
      const role = await this.db.role.update({
        where: { id: params.id },
        data: {
          name: name,
          description: description,
          permissions: {
            deleteMany: {},
            create: permissions.map((permission) => ({
              permission: { connect: { id: permission } },
            })),
          },
        },
        include: this.includes(),
      });

      this.auditService.sendAudit(ctx, AuditAction.UPDATED, {
        id: role.id,
        prev: currentRole,
        incoming: role,
        auditable: Auditable.ROLE,
      });

      return role;
    } catch (error: any) {
      if (error.code === 'P2002') {
        if (name) throw new roleException.DuplicateRole({ name });
      }

      throw error;
    }
  }

  public async delete(ctx: IContext, params: IUpdateRoleRequestParams): Promise<Role> {
    const currentRole = await this.db.role.findUnique({
      where: { id: params.id },
      include: this.includes(),
    });

    if (!currentRole) {
      throw new roleException.RoleNotFound({ id: params.id });
    }

    const role = await this.db.role.delete({
      where: { id: params.id },
      include: this.includes(),
    });

    this.auditService.sendAudit(ctx, AuditAction.DELETED, {
      id: role.id,
      prev: currentRole,
      auditable: Auditable.ROLE,
    });

    return role;
  }

  private includes = () => ({
    permissions: {
      include: {
        permission: true,
      },
    },
  });
}
