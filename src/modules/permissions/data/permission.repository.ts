import { BaseRepository } from '@/core/base/data/base.repository';
import { Cache } from 'cache-manager';
import { Prisma } from '@prisma/client';
import { Permission } from '../domain/entities/permission.entity';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class PermissionRepository extends BaseRepository<
  Permission,
  Prisma.PermissionInclude,
  Prisma.PermissionSelect,
  Prisma.PermissionWhereInput | Prisma.PermissionWhereUniqueInput,
  Prisma.XOR<
    Prisma.PermissionCreateInput,
    Prisma.PermissionUncheckedCreateInput
  >,
  Prisma.PermissionCreateManyInput[] | Prisma.PermissionCreateManyArgs,
  Prisma.XOR<
    Prisma.PermissionUpdateInput,
    Prisma.PermissionUncheckedUpdateInput
  >
> {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(Permission, cacheManager);
  }
}
