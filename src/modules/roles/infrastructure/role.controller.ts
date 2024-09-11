import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleUseCase } from '../domain/usecase/role.usecase';
import {
  CreateRoleSerializer,
  DeleteRoleSerializer,
  GetRoleSerializer,
  ListRoleSerializer,
  UpdateRoleSerializer,
  UpsertRoleSerializer,
} from '@/modules/roles/domain/entities/role.serializer';
import {
  CreateRoleValidator,
  DeleteRoleBatchBodyValidator,
  FilterCursorRoleQueryValidator,
  FilterPaginationRoleQueryValidator,
  ListCursorRoleQueryValidator,
  ListPaginationRoleQueryValidator,
  UpdateRoleValidator,
  UpsertRoleValidator,
} from '@/modules/roles/domain/entities/role.validator';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import { OtelInstanceCounter } from 'nestjs-otel';

@ApiTags('Role')
@OtelInstanceCounter()
@Controller('role')
export class RoleController extends ControllerFactory<
  UpsertRoleValidator,
  CreateRoleValidator,
  UpdateRoleValidator,
  DeleteRoleBatchBodyValidator
>(
  'role',
  'role',
  FilterPaginationRoleQueryValidator,
  FilterCursorRoleQueryValidator,
  ListRoleSerializer,
  ListPaginationRoleQueryValidator,
  ListCursorRoleQueryValidator,
  UpsertRoleSerializer,
  UpsertRoleValidator,
  CreateRoleSerializer,
  CreateRoleValidator,
  GetRoleSerializer,
  UpdateRoleSerializer,
  UpdateRoleValidator,
  DeleteRoleSerializer,
  DeleteRoleBatchBodyValidator,
) {
  constructor(public _usecase: RoleUseCase) {
    super();
  }
}
