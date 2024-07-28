import { Injectable } from '@nestjs/common';
import { OtelMethodCounter, Span } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { RoleRepository } from '../../data/role.repository';
import {
  TCreateRoleRequestBody,
  TUpdateRoleRequestBody,
  TUpsertRoleRequestBody,
  Role,
} from '../entities/role.entity';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';
import { Prisma } from '@prisma/client';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Injectable()
export class RoleUseCase extends BaseUseCase<
  Role,
  Prisma.RoleInclude,
  Prisma.RoleSelect,
  Prisma.RoleWhereInput | Prisma.RoleWhereUniqueInput,
  Prisma.XOR<Prisma.RoleCreateInput, Prisma.RoleUncheckedCreateInput>,
  Prisma.RoleCreateManyInput[] | Prisma.RoleCreateManyInput,
  Prisma.XOR<Prisma.RoleUpdateInput, Prisma.RoleUncheckedUpdateInput>
> {
  constructor(
    protected repository: RoleRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }

  @OtelMethodCounter()
  @Span('usecase create role')
  override async upsert(
    ctx: IContext,
    body: TUpsertRoleRequestBody,
  ): Promise<Role> {
    try {
      return await this.db.$transaction(async (tx) => {
        const create: Prisma.RoleCreateInput = {
          description: body.description,
          name: body.name,
          permissions: {
            create: body.permissions.map((permission) => ({
              permission: { connect: { id: permission } },
            })),
          },
        };

        const update: Prisma.RoleUpdateInput = {
          description: body.description,
          name: body.name,
          permissions: {
            deleteMany: {},
            create: body.permissions.map((permission) => ({
              permission: { connect: { id: permission } },
            })),
          },
        };

        return await this.repository.upsert(
          true,
          ctx,
          body.name,
          tx,
          create,
          update,
        );
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during create a role!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * This is overriding method
   * @param {TCreateRoleRequestBody} body
   * @returns {Promise<Role>}
   */
  @OtelMethodCounter()
  @Span('usecase create role')
  override async create(
    ctx: IContext,
    body: TCreateRoleRequestBody,
  ): Promise<Role> {
    try {
      return await this.db.$transaction(async (tx) => {
        const bodyModified: Prisma.RoleCreateInput = {
          description: body.description,
          name: body.name,
          permissions: {
            create: body.permissions.map((permission) => ({
              permission: { connect: { id: permission } },
            })),
          },
        };

        return await this.repository.create(true, ctx, bodyModified, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during create a role!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * This is overriding method
   * @param {TUpdateRoleByIdRequestParams} params
   * @param {TUpdateRoleRequestBody} body
   * @returns {Promise<Role>}
   */
  @OtelMethodCounter()
  @Span('usecase update role')
  override async update(
    ctx: IContext,
    id: string,
    body: TUpdateRoleRequestBody,
  ): Promise<Role> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.getById(id, tx);

        const bodyModified: Prisma.RoleUpdateInput = {
          description: body.description,
          name: body.name,
          permissions: {
            deleteMany: {},
            create: body.permissions?.map((permission) => ({
              permission: { connect: { id: permission } },
            })),
          },
        };

        return await this.repository.update(true, ctx, id, bodyModified, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during change a role!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
