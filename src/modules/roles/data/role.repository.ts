import { BaseRepository } from '@/core/base/data/base.repository';
import { Cache } from 'cache-manager';
import { Prisma } from '@prisma/client';
import { Role } from '../domain/entities/role.entity';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class RoleRepository extends BaseRepository<
  Role,
  Prisma.RoleInclude,
  Prisma.RoleSelect,
  Prisma.RoleWhereInput | Prisma.RoleWhereUniqueInput,
  Prisma.XOR<Prisma.RoleCreateInput, Prisma.RoleUncheckedCreateInput>,
  Prisma.RoleCreateManyInput[] | Prisma.RoleCreateManyArgs,
  Prisma.XOR<Prisma.RoleUpdateInput, Prisma.RoleUncheckedUpdateInput>
> {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(Role, cacheManager);
    this.defaultInclude = {
      permissions: {
        include: {
          permission: true,
        },
      },
    };
  }
}
