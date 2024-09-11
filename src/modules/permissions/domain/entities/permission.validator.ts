import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Permission, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { TListPermissionRequestQuery } from './permission.entity';
import {
  BaseCursorQueryValidator,
  BasePaginationQueryValidator,
  IListCursorRequest,
  IListPaginationRequest,
  ListQueryField,
  StringFilterQuery,
} from '@/core/base/domain/entities';

// For field filter in list whether cursor or pagination
export class ListPermissionQueryField
  extends ListQueryField
  implements Prisma.PermissionWhereInput
{
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  alias?: string | Prisma.StringFilter<'Permission'> | undefined;
}

// Create filters class for Cursor Type
export class ListCursorPermissionQueryValidator extends BaseCursorQueryValidator<Permission> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPermissionQueryField)
  @ApiPropertyOptional({ type: ListPermissionQueryField })
  field?: ListPermissionQueryField;
}

// Create filters class for Pagination Type
export class ListPaginationPermissionQueryValidator extends BasePaginationQueryValidator<Permission> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPermissionQueryField)
  @ApiPropertyOptional({ type: ListPermissionQueryField })
  field?: ListPermissionQueryField;
}

// implement filter class for Cursor Type
export class FilterCursorPermissionQueryValidator
  implements TListPermissionRequestQuery<IListCursorRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListCursorPermissionQueryValidator)
  filters: ListCursorPermissionQueryValidator;
}

// implement filter class for Pagination Type
export class FilterPaginationPermissionQueryValidator
  implements TListPermissionRequestQuery<IListPaginationRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPaginationPermissionQueryValidator)
  filters: ListPaginationPermissionQueryValidator;
}
