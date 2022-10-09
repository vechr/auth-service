import { Module } from '@nestjs/common';
import PermissionController from './permission.controller';
import PermissionService from './permission.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
})
export default class PermissionModule {}
