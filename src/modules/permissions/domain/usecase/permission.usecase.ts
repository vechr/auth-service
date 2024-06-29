import { Injectable } from '@nestjs/common';
import PrismaService from '../../../../core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { PermissionRepository } from '../../data/permission.repository';
import { Permission } from '../entities/permission.entity';
import { Prisma } from '@prisma/client';
import { OtelMethodCounter, Span } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { log } from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';

@Injectable()
export class PermissionUseCase extends BaseUseCase<
  Permission,
  Prisma.PermissionInclude,
  Prisma.PermissionSelect,
  Prisma.PermissionWhereInput | Prisma.PermissionWhereUniqueInput,
  Prisma.XOR<
    Prisma.PermissionCreateInput,
    Prisma.PermissionUncheckedCreateInput
  >,
  Prisma.PermissionCreateManyInput[] | Prisma.PermissionCreateManyInput,
  Prisma.XOR<
    Prisma.PermissionUpdateInput,
    Prisma.PermissionUncheckedUpdateInput
  >
> {
  constructor(
    protected repository: PermissionRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }

  @Span('usecase all permissions')
  @OtelMethodCounter()
  async allPermissions(): Promise<Pick<Permission, 'id' | 'alias'>[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.repository.getMany(tx, undefined, {
          id: true,
          alias: true,
        });
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
