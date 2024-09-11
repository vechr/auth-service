import { Module } from '@nestjs/common';
import { PermissionRepository } from './data/permission.repository';
import { PermissionController } from './infrastructure/permission.controller';
import { PermissionUseCase } from './domain/usecase/permission.usecase';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Module({
  providers: [PermissionRepository, PrismaService, PermissionUseCase],
  exports: [PermissionRepository],
  controllers: [PermissionController],
})
export class PermissionModule {}
