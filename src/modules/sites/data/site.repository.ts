import { BaseRepository } from '@/core/base/data/base.repository';
import { Cache } from 'cache-manager';
import { Prisma } from '@prisma/client';
import { Site } from '../domain/entities/site.entity';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class SiteRepository extends BaseRepository<
  Site,
  Prisma.SiteInclude,
  Prisma.SiteSelect,
  Prisma.SiteWhereInput | Prisma.SiteWhereUniqueInput,
  Prisma.XOR<Prisma.SiteCreateInput, Prisma.SiteUncheckedCreateInput>,
  Prisma.SiteCreateManyInput[] | Prisma.SiteCreateManyArgs,
  Prisma.XOR<Prisma.SiteUpdateInput, Prisma.SiteUncheckedUpdateInput>
> {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(Site, cacheManager);
  }
}
