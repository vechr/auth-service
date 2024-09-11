import { Injectable } from '@nestjs/common';
import PrismaService from '../../../../core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { PermissionRepository } from '../../data/permission.repository';
import { Permission } from '../entities/permission.entity';
import { Prisma } from '@prisma/client';
import { OtelMethodCounter, Span, TraceService } from 'nestjs-otel';
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
    traceService: TraceService,
  ) {
    super(repository, db, traceService);
  }

  @OtelMethodCounter()
  @Span('allPermissions usecase')
  async allPermissions(): Promise<Pick<Permission, 'id' | 'alias'>[]> {
    const span = this.traceService.getSpan();
    try {
      const result = await this.db.$transaction(async (tx) => {
        span?.addEvent('call repository of get many');
        return await this.repository.getMany(tx, undefined, {
          id: true,
          alias: true,
        });
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
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
