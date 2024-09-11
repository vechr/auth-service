import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Role, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  TCreateRoleRequestBody,
  TListRoleRequestQuery,
  TUpdateRoleRequestBody,
  TUpsertRoleRequestBody,
} from './role.entity';
import {
  BaseCursorQueryValidator,
  BasePaginationQueryValidator,
  IListCursorRequest,
  IListPaginationRequest,
  ListQueryField,
} from '@/core/base/domain/entities';
import {
  CreateValidator,
  IDsValidator,
  UpdateValidator,
} from '@/core/base/domain/entities/validator.entity';

// For field filter in list whether cursor or pagination
export class ListRoleQueryField
  extends ListQueryField
  implements Prisma.RoleWhereInput {}

// Create filters class for Cursor Type
export class ListCursorRoleQueryValidator extends BaseCursorQueryValidator<Role> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListRoleQueryField)
  @ApiPropertyOptional({ type: ListRoleQueryField })
  field?: ListRoleQueryField;
}

// Create filters class for Pagination Type
export class ListPaginationRoleQueryValidator extends BasePaginationQueryValidator<Role> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListRoleQueryField)
  @ApiPropertyOptional({ type: ListRoleQueryField })
  field?: ListRoleQueryField;
}

// implement filter class for Cursor Type
export class FilterCursorRoleQueryValidator
  implements TListRoleRequestQuery<IListCursorRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListCursorRoleQueryValidator)
  filters: ListCursorRoleQueryValidator;
}

// implement filter class for Pagination Type
export class FilterPaginationRoleQueryValidator
  implements TListRoleRequestQuery<IListPaginationRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPaginationRoleQueryValidator)
  filters: ListPaginationRoleQueryValidator;
}

export class CreateRoleValidator
  extends CreateValidator
  implements TCreateRoleRequestBody
{
  @ApiProperty({
    example: ['d8beca16-5296-458a-bc8a-609d217fed08'],
    description: 'You can attach permission into this role!',
  })
  @IsArray()
  permissions: string[];
}

export class UpsertRoleValidator
  extends CreateRoleValidator
  implements TUpsertRoleRequestBody {}

export class DeleteRoleBatchBodyValidator extends IDsValidator {}

export class UpdateRoleValidator
  extends UpdateValidator
  implements TUpdateRoleRequestBody
{
  @ApiPropertyOptional({
    example: ['d8beca16-5296-458a-bc8a-609d217fed08'],
    description: 'You can attach permission into this role!',
  })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}
