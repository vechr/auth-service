import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { Site } from '../entities/site.entity';
import { Prisma } from '@prisma/client';
import { SiteRepository } from '../../data/site.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { TraceService } from 'nestjs-otel';

@Injectable()
export class SiteUseCase extends BaseUseCase<
  Site,
  Prisma.SiteInclude,
  Prisma.SiteSelect,
  Prisma.SiteWhereInput | Prisma.SiteWhereUniqueInput,
  Prisma.XOR<Prisma.SiteCreateInput, Prisma.SiteUncheckedCreateInput>,
  Prisma.SiteCreateManyInput[] | Prisma.SiteCreateManyInput,
  Prisma.XOR<Prisma.SiteUpdateInput, Prisma.SiteUncheckedUpdateInput>
> {
  constructor(
    protected repository: SiteRepository,
    db: PrismaService,
    traceService: TraceService,
  ) {
    super(repository, db, traceService);
  }
}
