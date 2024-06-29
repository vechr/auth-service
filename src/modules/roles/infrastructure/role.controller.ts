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
  DeleteRoleParamsValidator,
  FilterCursorRoleQueryValidator,
  FilterPaginationRoleQueryValidator,
  GetRoleParamsValidator,
  ListCursorRoleQueryValidator,
  ListPaginationRoleQueryValidator,
  UpdateRoleParamsValidator,
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
  GetRoleParamsValidator,
  UpdateRoleValidator,
  UpdateRoleParamsValidator,
  DeleteRoleBatchBodyValidator,
  DeleteRoleParamsValidator
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
  GetRoleParamsValidator,
  UpdateRoleSerializer,
  UpdateRoleValidator,
  UpdateRoleParamsValidator,
  DeleteRoleSerializer,
  DeleteRoleBatchBodyValidator,
  DeleteRoleParamsValidator,
) {
  constructor(public _usecase: RoleUseCase) {
    super();
  }
}
