import { Permission, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { TListPermissionRequestQuery } from '../requests/list-permission.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

class ListPermissionQueryField implements Prisma.PermissionWhereInput {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  id?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  @ApiPropertyOptional({ type: OperatorQuery })
  alias?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  name?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  description?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  permissionType: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  createdAt?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  updatedAt?: OperatorQuery;
}

export class ListPermissionQueryValidator extends BaseQueryValidator<Permission> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPermissionQueryField)
  @ApiPropertyOptional({ type: ListPermissionQueryField })
  field?: ListPermissionQueryField;
}

class FilterPermissionQueryValidator implements TListPermissionRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPermissionQueryValidator)
  filters: ListPermissionQueryValidator;
}

export default class ListPermissionValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterPermissionQueryValidator)
  query: FilterPermissionQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
